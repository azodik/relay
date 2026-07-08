<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Project;
use App\Models\Source;
use App\Models\User;
use App\Support\ProjectContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

/**
 * @property-read ProjectContext $projectContext
 */
trait InteractsWithCurrentProject
{
    protected function projectFor(?User $user = null): Project
    {
        $user ??= Auth::user();

        abort_unless($user instanceof User, 403);

        $projectSlug = request()->route('project');

        return $this->projectContext->projectFor(
            $user,
            is_string($projectSlug) ? $projectSlug : null,
        );
    }

    protected function sourceFor(Project $project): Source
    {
        return $this->projectContext->currentSource($project);
    }

    protected function toProjectSection(Project $project, string $section): RedirectResponse
    {
        $projectSlug = request()->route('project');

        if (is_string($projectSlug)) {
            return redirect($this->projectContext->sectionPath($project, $section));
        }

        return to_route($section === 'activity' ? 'activity' : $section);
    }
}
