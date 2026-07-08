<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Relay API Client (azodik/relay package)
    |--------------------------------------------------------------------------
    |
    | Used when this app (or another Laravel app) sends mail through the
    | Azodik Relay HTTP API / mail transport.
    |
    */

    'api_key' => env('RELAY_API_KEY'),
    'endpoint' => env('RELAY_ENDPOINT', 'https://relay.azodik.com'),
    'timeout' => env('RELAY_TIMEOUT', 15),

    /*
    |--------------------------------------------------------------------------
    | Open Registration
    |--------------------------------------------------------------------------
    |
    | Registration is always available while the instance has no users, so
    | the first person to visit can create the owner account. After that,
    | new members are invited from workspace settings. Set this to true to
    | keep public self-registration open after the first user exists.
    |
    */

    'open_registration' => env('RELAY_OPEN_REGISTRATION', false),

    /*
    |--------------------------------------------------------------------------
    | Marketing Landing Page
    |--------------------------------------------------------------------------
    |
    | When enabled, "/" serves the public Welcome landing (with Sign in /
    | Dashboard CTAs). Set to false on private self-hosted installs so
    | visitors go straight to registration (no owner yet) or login.
    |
    */

    'show_landing_page' => env('RELAY_SHOW_LANDING_PAGE', true),

];
