<?php

use Azodik\Relay\Facades\Relay;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

it('sends email through the Azodik Relay API client', function () {
    config()->set('relay.api_key', 'ls_test_key');
    config()->set('relay.endpoint', 'https://emails.savvyagents.ai');

    Http::fake([
        'emails.savvyagents.ai/api/emails' => Http::response([
            'id' => 'email_test',
            'object' => 'email',
        ], 202),
    ]);

    $response = Relay::emails()->send([
        'from' => 'Savvy Agents <receipts@mail.savvyagents.ai>',
        'to' => ['person@example.com'],
        'subject' => 'Azodik Relay test',
        'text' => 'Hello from Azodik Relay.',
    ]);

    expect($response)->toBe([
        'id' => 'email_test',
        'object' => 'email',
    ]);

    Http::assertSent(fn ($request) => $request->hasHeader('Authorization', 'Bearer ls_test_key')
        && $request->url() === 'https://emails.savvyagents.ai/api/emails'
        && $request['to'] === ['person@example.com']);
});

it('sends Laravel mail through the Azodik Relay mailer transport', function () {
    config()->set('mail.default', 'relay');
    config()->set('mail.from.address', 'receipts@mail.savvyagents.ai');
    config()->set('mail.from.name', 'Savvy Agents');
    config()->set('relay.api_key', 'ls_test_key');
    config()->set('relay.endpoint', 'https://emails.savvyagents.ai');

    Http::fake([
        'emails.savvyagents.ai/api/emails' => Http::response([
            'id' => 'email_transport_test',
            'object' => 'email',
        ], 202),
    ]);

    Mail::raw('Hello from a local Laravel app.', function ($message) {
        $message
            ->to('person@example.com')
            ->subject('Azodik Relay local Laravel test')
            ->getHeaders()
            ->addTextHeader('X-App-Test', 'relay');
    });

    Http::assertSent(function ($request) {
        $payload = $request->data();

        return $request->url() === 'https://emails.savvyagents.ai/api/emails'
            && $payload['from'] === 'Savvy Agents <receipts@mail.savvyagents.ai>'
            && $payload['to'] === ['person@example.com']
            && $payload['subject'] === 'Azodik Relay local Laravel test'
            && $payload['text'] === 'Hello from a local Laravel app.'
            && $payload['headers'] === ['X-App-Test' => 'relay'];
    });
});
