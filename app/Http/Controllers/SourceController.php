<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithCurrentProject;
use App\Http\Requests\UpdateSourceRequest;
use App\Services\SesV2Client;
use App\Support\ProjectContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use RuntimeException;
use Throwable;

class SourceController extends Controller
{
    use InteractsWithCurrentProject;

    public function __construct(
        private ProjectContext $projectContext,
    ) {}

    public function update(UpdateSourceRequest $request): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('manageDomains', $project);

        $source = $this->sourceFor($project);
        $validated = $request->validated();

        if (blank($validated['aws_access_key_id'] ?? null)) {
            unset($validated['aws_access_key_id']);
        }

        if (blank($validated['aws_secret_access_key'] ?? null)) {
            unset($validated['aws_secret_access_key']);
        }

        if (blank($validated['aws_session_token'] ?? null)) {
            unset($validated['aws_session_token']);
        }

        $source->update($validated);
        $project->forceFill(['default_environment' => $source->environment])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'SES source updated.']);

        return $this->toProjectSection($project, 'identities');
    }

    public function syncQuota(Request $request, SesV2Client $sesClient): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('manageDomains', $project);

        $source = $this->sourceFor($project);
        $silent = $request->boolean('silent');

        try {
            $account = $sesClient->getAccount($source);
        } catch (RuntimeException $exception) {
            if (! $silent) {
                Inertia::flash('toast', ['type' => 'error', 'message' => $exception->getMessage()]);
            }

            return $this->toProjectSection($project, 'setup');
        } catch (Throwable $exception) {
            report($exception);

            if (! $silent) {
                Inertia::flash('toast', ['type' => 'error', 'message' => 'Could not sync SES quota: '.$exception->getMessage()]);
            }

            return $this->toProjectSection($project, 'setup');
        }

        $source->forceFill([
            'last_quota' => $account['SendQuota'] ?? $account,
            'last_quota_checked_at' => now(),
        ])->save();

        if (! $silent) {
            Inertia::flash('toast', ['type' => 'success', 'message' => 'SES quota synced.']);
        }

        return $this->toProjectSection($project, 'setup');
    }
}
