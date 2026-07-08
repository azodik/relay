<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Support\ProjectContext;

class ProjectPolicy
{
    public function view(User $user, Project $project): bool
    {
        return $project->workspace->roleFor($user) !== null;
    }

    public function create(User $user): bool
    {
        $workspace = app(ProjectContext::class)->workspaceFor($user);

        return $workspace->canManageMembers($user);
    }

    public function manage(User $user, Project $project): bool
    {
        return $project->workspace->canManageMembers($user);
    }

    public function update(User $user, Project $project): bool
    {
        return $this->manage($user, $project);
    }

    public function delete(User $user, Project $project): bool
    {
        return $this->manage($user, $project);
    }

    public function archive(User $user, Project $project): bool
    {
        return $this->manage($user, $project);
    }

    public function restore(User $user, Project $project): bool
    {
        return $this->manage($user, $project);
    }

    public function sendEmail(User $user, Project $project): bool
    {
        return $project->workspace->canSendEmail($user);
    }

    public function manageApiKeys(User $user, Project $project): bool
    {
        return $project->workspace->canManageApiKeys($user);
    }

    public function manageDomains(User $user, Project $project): bool
    {
        return $project->workspace->canManageDomains($user);
    }

    public function manageTemplates(User $user, Project $project): bool
    {
        return $project->workspace->canManageTemplates($user);
    }

    public function manageWebhooks(User $user, Project $project): bool
    {
        return $project->workspace->canManageWebhooks($user);
    }
}
