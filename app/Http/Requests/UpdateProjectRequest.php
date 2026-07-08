<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Support\ProjectContext;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user instanceof User) {
            return false;
        }

        $projectSlug = $this->route('project');

        if (! is_string($projectSlug)) {
            return false;
        }

        $project = app(ProjectContext::class)->workspaceFor($user)
            ->projects()
            ->where('slug', $projectSlug)
            ->first();

        return $project !== null && $user->can('update', $project);
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:80'],
            'slug' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
        ];
    }
}
