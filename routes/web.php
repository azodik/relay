<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ActivityExportController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\DashboardEmailController;
use App\Http\Controllers\DomainController;
use App\Http\Controllers\EmailMimeController;
use App\Http\Controllers\EmailPreviewController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SourceController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\WebhookEndpointController;
use App\Http\Controllers\WorkspaceMemberController;
use App\Support\RegistrationAvailability;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (! config('relay.show_landing_page')) {
        return redirect()->route(RegistrationAvailability::isOpen() ? 'register' : 'login');
    }

    return Inertia::render('Welcome', [
        'canRegister' => Features::enabled(Features::registration())
            && RegistrationAvailability::isOpen(),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [OnboardingController::class, 'entry'])->name('dashboard');
    Route::get('onboarding', [OnboardingController::class, 'show'])->name('onboarding');
    Route::post('onboarding', [OnboardingController::class, 'store'])->name('onboarding.store');
    Route::get('projects', ActivityController::class)->defaults('section', 'projects')->name('projects.index');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::post('projects/{project}/archive', [ProjectController::class, 'archive'])->name('projects.archive');
    Route::post('projects/{project}/restore', [ProjectController::class, 'restore'])->name('projects.restore');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::post('workspace/members', [WorkspaceMemberController::class, 'store'])->name('workspace-members.store');
    Route::put('workspace/members/{user}', [WorkspaceMemberController::class, 'update'])->name('workspace-members.update');
    Route::delete('workspace/members/{user}', [WorkspaceMemberController::class, 'destroy'])->name('workspace-members.destroy');

    Route::prefix('projects/{project}')->name('projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'show'])->name('show');
        Route::get('activity/export', ActivityExportController::class)->name('activity.export');
        Route::put('source', [SourceController::class, 'update'])->name('source.update');
        Route::post('source/quota', [SourceController::class, 'syncQuota'])->name('source.quota.sync');
        Route::post('domains', [DomainController::class, 'store'])->name('domains.store');
        Route::post('domains/{domain}/check-dns', [DomainController::class, 'check'])->name('domains.check-dns');
        Route::delete('domains/{domain}', [DomainController::class, 'destroy'])->name('domains.destroy');
        Route::post('templates', [TemplateController::class, 'store'])->name('templates.store');
        Route::post('api-keys', [ApiKeyController::class, 'store'])->name('api-keys.store');
        Route::post('api-keys/{apiKey}/rotate', [ApiKeyController::class, 'rotate'])->name('api-keys.rotate');
        Route::delete('api-keys/{apiKey}', [ApiKeyController::class, 'destroy'])->name('api-keys.destroy');
        Route::post('webhooks', [WebhookEndpointController::class, 'store'])->name('webhooks.store');
        Route::put('webhooks/{endpoint:public_id}', [WebhookEndpointController::class, 'update'])->name('webhooks.update');
        Route::post('send', [DashboardEmailController::class, 'send'])->name('send.store');
        Route::post('bounces/retry-soft', [DashboardEmailController::class, 'retrySoftBounces'])->name('bounces.retry-soft');
        Route::post('emails/{email:public_id}/resend', [DashboardEmailController::class, 'resend'])->name('emails.resend');
        Route::get('{section}', ActivityController::class)
            ->where('section', 'activity|sent|bounces|complaints|suppressions|identities|templates|webhooks|api-keys|send|setup|projects')
            ->name('section');
    });

    Route::get('activity', ActivityController::class)->defaults('section', 'activity')->name('activity');
    Route::get('activity/export', ActivityExportController::class)->name('activity.export');
    Route::get('sent', ActivityController::class)->defaults('section', 'sent')->name('sent');
    Route::get('bounces', ActivityController::class)->defaults('section', 'bounces')->name('bounces');
    Route::get('complaints', ActivityController::class)->defaults('section', 'complaints')->name('complaints');
    Route::get('suppressions', ActivityController::class)->defaults('section', 'suppressions')->name('suppressions');
    Route::get('identities', ActivityController::class)->defaults('section', 'identities')->name('identities');
    Route::get('templates', ActivityController::class)->defaults('section', 'templates')->name('templates');
    Route::get('webhooks', ActivityController::class)->defaults('section', 'webhooks')->name('webhooks');
    Route::get('api-keys', ActivityController::class)->defaults('section', 'api-keys')->name('api-keys');
    Route::get('send', ActivityController::class)->defaults('section', 'send')->name('send');
    Route::get('setup', ActivityController::class)->defaults('section', 'setup')->name('setup');
    Route::post('domains', [DomainController::class, 'store'])->name('domains.store');
    Route::post('domains/{domain}/check-dns', [DomainController::class, 'check'])->name('domains.check-dns');
    Route::delete('domains/{domain}', [DomainController::class, 'destroy'])->name('domains.destroy');
    Route::put('source', [SourceController::class, 'update'])->name('source.update');
    Route::post('templates', [TemplateController::class, 'store'])->name('templates.store');
    Route::post('api-keys', [ApiKeyController::class, 'store'])->name('api-keys.store');
    Route::post('api-keys/{apiKey}/rotate', [ApiKeyController::class, 'rotate'])->name('api-keys.rotate');
    Route::delete('api-keys/{apiKey}', [ApiKeyController::class, 'destroy'])->name('api-keys.destroy');
    Route::post('webhooks', [WebhookEndpointController::class, 'store'])->name('webhooks.store');
    Route::put('webhooks/{endpoint:public_id}', [WebhookEndpointController::class, 'update'])->name('webhooks.update');
    Route::post('send', [DashboardEmailController::class, 'send'])->name('send.store');
    Route::post('bounces/retry-soft', [DashboardEmailController::class, 'retrySoftBounces'])->name('bounces.retry-soft');
    Route::post('emails/{email:public_id}/resend', [DashboardEmailController::class, 'resend'])->name('emails.resend');
    Route::get('emails/{email:public_id}/preview', EmailPreviewController::class)->name('emails.preview');
    Route::get('emails/{email:public_id}/mime', EmailMimeController::class)->name('emails.mime');
});

require __DIR__.'/settings.php';
