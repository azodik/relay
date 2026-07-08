<?php

namespace App\Services;

use Illuminate\Support\Arr;
use RuntimeException;

class DkimDnsRecordBuilder
{
    /**
     * @param  array<int, string>  $tokens
     * @return array<int, array{type: string, name: string, value: string, status: string}>
     *
     * @throws RuntimeException When tokens are empty and local fallback is disabled.
     */
    public function build(string $domain, array $tokens, bool $allowLocalFallback = false): array
    {
        $records = collect($tokens)
            ->map(fn (string $token): array => [
                'type' => 'CNAME',
                'name' => "{$token}._domainkey.{$domain}",
                'value' => "{$token}.dkim.amazonses.com",
                'status' => 'pending',
            ]);

        if ($records->isEmpty()) {
            if (! $allowLocalFallback) {
                throw new RuntimeException(
                    'SES did not return DKIM tokens for this identity. Check the source credentials and try again.',
                );
            }

            $records = $records->push([
                'type' => 'TXT',
                'name' => "_amazonses.{$domain}",
                'value' => Arr::random(['created-by-relay-local-mode']),
                'status' => 'ok',
            ]);
        }

        return $records->values()->all();
    }
}
