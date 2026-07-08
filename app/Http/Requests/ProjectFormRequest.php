<?php

namespace App\Http\Requests;

use App\Models\Project;
use App\Models\User;
use App\Support\ProjectContext;
use Illuminate\Foundation\Http\FormRequest;

abstract class ProjectFormRequest extends FormRequest
{
    protected function currentProject(): ?Project
    {
        $user = $this->user();

        if (! $user instanceof User) {
            return null;
        }

        $projectSlug = $this->route('project');

        return app(ProjectContext::class)->projectFor(
            $user,
            is_string($projectSlug) ? $projectSlug : null,
        );
    }

    protected function userCan(string $ability): bool
    {
        $user = $this->user();
        $project = $this->currentProject();

        return $user instanceof User
            && $project instanceof Project
            && $user->can($ability, $project);
    }
}
