<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithCurrentProject;
use App\Http\Requests\StoreWebhookEndpointRequest;
use App\Models\WebhookEndpoint;
use App\Support\ProjectContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WebhookEndpointController extends Controller
{
    use InteractsWithCurrentProject;

    public function __construct(
        private ProjectContext $projectContext,
    ) {}

    public function store(StoreWebhookEndpointRequest $request): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('manageWebhooks', $project);

        $validated = $request->validated();
        $issued = WebhookEndpoint::issue($project, $validated['url'], $validated['events'], $validated['status']);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Webhook endpoint created. Copy the signing secret now; it will not be shown again.']);

        return $this->toProjectSection($project, 'webhooks')->with('newWebhookEndpoint', [
            'id' => $issued['endpoint']->public_id,
            'url' => $issued['endpoint']->url,
            'secret' => $issued['plain_text'],
            'events' => $issued['endpoint']->events,
        ]);
    }

    public function update(StoreWebhookEndpointRequest $request, WebhookEndpoint $endpoint): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('manageWebhooks', $project);

        abort_unless($endpoint->project_id === $project->id, 404);

        $endpoint->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Webhook endpoint updated.']);

        return $this->toProjectSection($project, 'webhooks');
    }
}
