<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workspace;

class WorkspacePolicy
{
    public function view(User $user, Workspace $workspace): bool
    {
        return $workspace->roleFor($user) !== null;
    }

    public function manageMembers(User $user, Workspace $workspace): bool
    {
        return $workspace->canManageMembers($user);
    }

    public function sendEmail(User $user, Workspace $workspace): bool
    {
        return $workspace->canSendEmail($user);
    }

    public function manageApiKeys(User $user, Workspace $workspace): bool
    {
        return $workspace->canManageApiKeys($user);
    }

    public function manageDomains(User $user, Workspace $workspace): bool
    {
        return $workspace->canManageDomains($user);
    }

    public function manageTemplates(User $user, Workspace $workspace): bool
    {
        return $workspace->canManageTemplates($user);
    }

    public function manageWebhooks(User $user, Workspace $workspace): bool
    {
        return $workspace->canManageWebhooks($user);
    }
}
