<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithCurrentProject;
use App\Http\Requests\StoreApiKeyRequest;
use App\Models\ApiKey;
use App\Support\ProjectContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApiKeyController extends Controller
{
    use InteractsWithCurrentProject;

    public function __construct(
        private ProjectContext $projectContext,
    ) {}

    public function store(StoreApiKeyRequest $request): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('manageApiKeys', $project);

        $issued = ApiKey::issue(
            $project,
            $request->string('name')->toString(),
            $this->sourceFor($project),
            $request->validated('scopes') ?: ['send', 'read:activity'],
            $request->date('expires_at'),
        );

        Inertia::flash([
            'toast' => ['type' => 'success', 'message' => 'API key created. Copy it now; it will not be shown again.'],
        ]);

        return $this->toProjectSection($project, 'api-keys')->with('newApiKey', $issued['plain_text']);
    }

    public function destroy(string|ApiKey $projectOrApiKey, ?ApiKey $apiKey = null): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('manageApiKeys', $project);

        $apiKey = $apiKey ?? $projectOrApiKey;

        abort_unless($apiKey instanceof ApiKey, 404);
        abort_unless($apiKey->project_id === $project->id, 404);

        $apiKey->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'API key deleted.']);

        return $this->toProjectSection($project, 'api-keys');
    }

    public function rotate(string|ApiKey $projectOrApiKey, ?ApiKey $apiKey = null): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('manageApiKeys', $project);

        $apiKey = $apiKey ?? $projectOrApiKey;

        abort_unless($apiKey instanceof ApiKey, 404);
        abort_unless($apiKey->project_id === $project->id, 404);

        $issued = ApiKey::issue(
            $project,
            $apiKey->name,
            $apiKey->source,
            $apiKey->scopes ?: ['send', 'read:activity'],
            $apiKey->expires_at,
        );

        $apiKey->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'API key rotated. Copy the new key now.']);

        return $this->toProjectSection($project, 'api-keys')->with('newApiKey', $issued['plain_text']);
    }
}
