<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithCurrentProject;
use App\Http\Requests\StoreDomainRequest;
use App\Models\Domain;
use App\Services\DkimDnsRecordBuilder;
use App\Services\DnsRecordVerifier;
use App\Services\SesV2Client;
use App\Support\ProjectContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use RuntimeException;

class DomainController extends Controller
{
    use InteractsWithCurrentProject;

    public function __construct(
        private ProjectContext $projectContext,
        private DkimDnsRecordBuilder $dnsBuilder,
        private DnsRecordVerifier $dnsVerifier,
    ) {}

    public function store(StoreDomainRequest $request, SesV2Client $sesClient): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('manageDomains', $project);

        $source = $this->sourceFor($project);
        $domainName = Str::lower(trim($request->string('domain')->toString()));

        try {
            $identity = $sesClient->createEmailIdentity($source, $domainName);
        } catch (RuntimeException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $exception->getMessage()]);

            return back()->withErrors(['domain' => $exception->getMessage()])->withInput();
        }

        $records = $this->dnsBuilder->build($domainName, $identity['tokens'], allowLocalFallback: true);

        $domain = $project->domains()->updateOrCreate(
            ['domain' => $domainName],
            [
                'status' => 'pending',
                'dns_records' => $records,
                'verified_at' => null,
            ],
        );

        $source->forceFill(['domain_id' => $domain->id])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Domain added. Add the DKIM records before sending production traffic.']);

        return $this->toProjectSection($project, 'identities');
    }

    public function check(string|Domain $projectOrDomain, ?Domain $domain = null): RedirectResponse
    {
        $domain = $domain ?? $projectOrDomain;

        abort_unless($domain instanceof Domain, 404);

        $project = $this->projectFor(Auth::user());
        $this->authorize('manageDomains', $project);

        abort_unless($domain->project_id === $project->id, 404);

        $records = collect($domain->dns_records ?? [])
            ->map(function (array $record) {
                return [
                    ...$record,
                    'status' => $this->dnsVerifier->matches($record) ? 'ok' : 'pending',
                ];
            })
            ->values()
            ->all();

        $allRecordsPass = collect($records)->every(fn (array $record) => ($record['status'] ?? null) === 'ok');

        $domain->forceFill([
            'status' => $allRecordsPass ? 'verified' : 'pending',
            'dns_records' => $records,
            'verified_at' => $allRecordsPass ? now() : null,
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'DNS records re-checked.']);

        return $this->toProjectSection($project, 'identities');
    }

    public function destroy(string|Domain $projectOrDomain, ?Domain $domain = null): RedirectResponse
    {
        $domain = $domain ?? $projectOrDomain;

        abort_unless($domain instanceof Domain, 404);

        $project = $this->projectFor(Auth::user());
        $this->authorize('manageDomains', $project);

        abort_unless($domain->project_id === $project->id, 404);

        $project->sources()
            ->where('domain_id', $domain->id)
            ->update(['domain_id' => null]);

        $domain->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Domain deleted.']);

        return $this->toProjectSection($project, 'identities');
    }
}
