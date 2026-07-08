<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Source;
use Illuminate\Support\Str;
use Throwable;

class SendingEligibility
{
    public function __construct(private SesV2Client $sesClient) {}

    /**
     * Whether the project/source may send from a product readiness perspective.
     * Used by the dashboard gate (credentials + verified domain + complaint rate).
     */
    public function canSend(Project $project, Source $source): bool
    {
        return $this->hasSendingCredentials($source)
            && $this->hasVerifiedDomain($project)
            && ! $this->complaintRateIsTooHigh($project);
    }

    /**
     * Whether SES credentials (or an instance role in production) are available.
     */
    public function hasSendingCredentials(Source $source): bool
    {
        return filled($source->aws_access_key_id)
            || app()->environment('production');
    }

    public function hasVerifiedDomain(Project $project): bool
    {
        return $project->domains()
            ->whereIn('status', ['verified', 'local'])
            ->exists();
    }

    public function complaintRateIsTooHigh(Project $project): bool
    {
        $since = now()->subDays(30);
        $total = $project->emails()->where('created_at', '>=', $since)->count();

        if ($total < 100) {
            return false;
        }

        $complaints = $project->emails()
            ->where('created_at', '>=', $since)
            ->where('status', 'complained')
            ->count();

        return ($complaints / $total) >= 0.001;
    }

    public function hasFreshQuota(Source $source): bool
    {
        return $source->last_quota_checked_at?->greaterThan(now()->subHours(6)) === true
            && filled($source->last_quota);
    }

    public function refreshSourceQuota(Source $source): void
    {
        try {
            $account = $this->sesClient->getAccount($source);
        } catch (Throwable $exception) {
            report($exception);

            return;
        }

        $source->forceFill([
            'last_quota' => $account['SendQuota'] ?? $account,
            'last_quota_checked_at' => now(),
        ])->save();
    }

    public function ensureFreshQuota(Source $source): void
    {
        if (! $this->hasFreshQuota($source)) {
            $this->refreshSourceQuota($source);
        }
    }

    public function fromAddressUsesVerifiedDomain(Project $project, string $fromEmail): bool
    {
        $fromDomain = Str::lower(Str::after($fromEmail, '@'));

        if ($fromDomain === '') {
            return false;
        }

        return $project->domains()
            ->whereIn('status', ['verified', 'local'])
            ->pluck('domain')
            ->contains(function (string $domain) use ($fromDomain): bool {
                $domain = Str::lower($domain);

                return $fromDomain === $domain
                    || Str::endsWith($fromDomain, '.'.$domain)
                    || Str::endsWith($domain, '.'.$fromDomain);
            });
    }
}
