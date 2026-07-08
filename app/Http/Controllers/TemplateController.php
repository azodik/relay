<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithCurrentProject;
use App\Http\Requests\StoreTemplateRequest;
use App\Support\ProjectContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TemplateController extends Controller
{
    use InteractsWithCurrentProject;

    public function __construct(
        private ProjectContext $projectContext,
    ) {}

    public function store(StoreTemplateRequest $request): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('manageTemplates', $project);

        $validated = $request->validated();
        $variables = collect(explode(',', (string) ($validated['variables'] ?? '')))
            ->map(fn (string $variable) => trim($variable))
            ->filter()
            ->values()
            ->all();

        $project->templates()->updateOrCreate(
            ['slug' => $validated['slug']],
            [
                'name' => $validated['name'],
                'subject' => $validated['subject'],
                'html' => $validated['html'] ?? null,
                'text' => $validated['text'] ?? null,
                'variables' => $variables,
            ],
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Template saved.']);

        return $this->toProjectSection($project, 'templates');
    }
}
