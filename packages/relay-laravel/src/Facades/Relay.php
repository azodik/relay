<?php

namespace Azodik\Relay\Facades;

use Azodik\Relay\RelayClient;
use Illuminate\Support\Facades\Facade;

class Relay extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return RelayClient::class;
    }
}
