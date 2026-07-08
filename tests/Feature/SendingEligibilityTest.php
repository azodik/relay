<?php

use App\Models\Project;
use App\Models\Source;
use App\Models\User;
use App\Models\Workspace;
use App\Services\SendingEligibility;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->eligibility = app(SendingEligibility::class);
});

/**
 * @param  array<string, mixed>  $sourceAttributes
 * @param  array<string, mixed>|null  $domainAttributes  Pass null to skip creating a domain.
 * @return array{0: Project, 1: Source}
 */
function seededProjectWithSource(array $sourceAttributes = [], ?array $domainAttributes = []): array
{
    $user = User::factory()->create();
    $workspace = Workspace::query()->create([
        'owner_id' => $user->id,
        'name' => 'Relay',
        'slug' => 'relay',
    ]);
    $workspace->users()->attach($user->id, ['role' => 'owner']);

    $project = Project::query()->create([
        'workspace_id' => $workspace->id,
        'name' => 'Harbor',
        'slug' => 'harbor',
        'default_environment' => 'prod',
    ]);

    $source = Source::query()->create(array_merge([
        'project_id' => $project->id,
        'name' => 'Production',
        'environment' => 'prod',
        'ses_region' => 'us-east-1',
        'webhook_token' => (string) str()->uuid(),
        'aws_access_key_id' => 'AKIATEST',
        'aws_secret_access_key' => 'secret',
    ], $sourceAttributes));

    if ($domainAttributes !== null) {
        $project->domains()->create(array_merge([
            'domain' => 'mail.example.com',
            'status' => 'verified',
            'verified_at' => now(),
        ], $domainAttributes));
    }

    return [$project->fresh(), $source->fresh()];
}

it('allows sending when credentials and a verified domain exist', function (): void {
    [$project, $source] = seededProjectWithSource();

    expect($this->eligibility->canSend($project, $source))->toBeTrue();
});

it('blocks sending without credentials outside production', function (): void {
    [$project, $source] = seededProjectWithSource([
        'aws_access_key_id' => null,
        'aws_secret_access_key' => null,
    ]);

    expect($this->eligibility->hasSendingCredentials($source))->toBeFalse()
        ->and($this->eligibility->canSend($project, $source))->toBeFalse();
});

it('blocks sending without a verified domain', function (): void {
    [$project, $source] = seededProjectWithSource(domainAttributes: [
        'status' => 'pending',
        'verified_at' => null,
    ]);

    expect($this->eligibility->hasVerifiedDomain($project))->toBeFalse()
        ->and($this->eligibility->canSend($project, $source))->toBeFalse();
});

it('matches verified parent and subdomain from addresses', function (): void {
    [$project] = seededProjectWithSource();

    expect($this->eligibility->fromAddressUsesVerifiedDomain($project, 'hello@mail.example.com'))->toBeTrue()
        ->and($this->eligibility->fromAddressUsesVerifiedDomain($project, 'hello@other.example.com'))->toBeFalse();
});
