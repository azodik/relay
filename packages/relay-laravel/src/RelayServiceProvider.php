<?php

namespace Azodik\Relay;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;

class RelayServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/relay.php', 'relay');

        $this->app->singleton(RelayClient::class, function () {
            return new RelayClient(
                apiKey: config('relay.api_key'),
                endpoint: config('relay.endpoint'),
                timeout: (int) config('relay.timeout', 15),
            );
        });
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../config/relay.php' => config_path('relay.php'),
        ], 'relay-config');

        Mail::extend('relay', function () {
            return new RelayTransport($this->app->make(RelayClient::class));
        });
    }
}
