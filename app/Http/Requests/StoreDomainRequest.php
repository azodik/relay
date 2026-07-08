<?php

namespace App\Http\Requests;

class StoreDomainRequest extends ProjectFormRequest
{
    public function authorize(): bool
    {
        return $this->userCan('manageDomains');
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'domain' => ['required', 'string', 'max:255', 'regex:/^(?!-)[A-Za-z0-9.-]+(?<!-)$/'],
        ];
    }
}
