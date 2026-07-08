<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Support\ProjectContext;

class DashboardSendEmailRequest extends SendEmailRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user instanceof User) {
            return false;
        }

        $projectSlug = $this->route('project');
        $project = app(ProjectContext::class)->projectFor(
            $user,
            is_string($projectSlug) ? $projectSlug : null,
        );

        return $user->can('sendEmail', $project);
    }

    protected function prepareForValidation(): void
    {
        $payload = [];

        foreach (['to', 'cc', 'bcc'] as $field) {
            if (! $this->exists($field)) {
                continue;
            }

            if (blank($this->input($field))) {
                $payload[$field] = [];

                continue;
            }

            if (is_string($this->input($field))) {
                $payload[$field] = collect(preg_split('/[\n,]+/', (string) $this->input($field)) ?: [])
                    ->map(fn (string $address) => trim($address))
                    ->filter()
                    ->values()
                    ->all();
            }
        }

        $this->merge($payload);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = parent::rules();
        unset($rules['attachments'], $rules['attachments.*.filename'], $rules['attachments.*.content'], $rules['attachments.*.content_type']);

        return $rules;
    }
}
