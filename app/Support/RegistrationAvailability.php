<?php

namespace App\Support;

use App\Models\User;

class RegistrationAvailability
{
    /**
     * Registration stays open until the first user exists, since members are
     * invited from workspace settings after that. RELAY_OPEN_REGISTRATION
     * keeps public self-registration open indefinitely.
     */
    public static function isOpen(): bool
    {
        return (bool) config('relay.open_registration')
            || User::query()->doesntExist();
    }
}
