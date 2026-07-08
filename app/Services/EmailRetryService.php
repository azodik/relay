<?php

namespace App\Services;

use App\Models\Email;

class EmailRetryService
{
    /**
     * @return array<string, mixed>
     */
    public function payloadForRetry(Email $email): array
    {
        return [
            'from' => trim(($email->from_name ? $email->from_name.' ' : '').'<'.$email->from_email.'>'),
            'to' => $email->recipients->where('type', 'to')->map(fn ($recipient) => $this->formatRecipient($recipient))->values()->all(),
            'cc' => $email->recipients->where('type', 'cc')->map(fn ($recipient) => $this->formatRecipient($recipient))->values()->all(),
            'bcc' => $email->recipients->where('type', 'bcc')->map(fn ($recipient) => $this->formatRecipient($recipient))->values()->all(),
            'subject' => $email->subject,
            'html' => $email->html,
            'text' => $email->text,
            'headers' => $email->headers ?? [],
            'tags' => array_merge($email->tags ?? [], ['resent_from' => $email->public_id]),
        ];
    }

    public function isSoftBounce(Email $email): bool
    {
        $event = $email->events->where('event_type', 'bounce')->sortByDesc('occurred_at')->first();
        $payload = $event?->payload ?? [];
        $bounce = $payload['bounce'] ?? $payload['Bounce'] ?? [];
        $tags = $email->tags ?? [];
        $type = strtolower((string) ($bounce['bounceType'] ?? $tags['bounce_type'] ?? ''));

        return in_array($type, ['transient', 'soft'], true);
    }

    private function formatRecipient(object $recipient): string
    {
        return $recipient->name ? "{$recipient->name} <{$recipient->email}>" : $recipient->email;
    }
}
