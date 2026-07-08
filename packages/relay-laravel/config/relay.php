<?php

return [
    'api_key' => env('RELAY_API_KEY'),
    'endpoint' => env('RELAY_ENDPOINT', 'https://relay.azodik.com'),
    'timeout' => env('RELAY_TIMEOUT', 15),
];
