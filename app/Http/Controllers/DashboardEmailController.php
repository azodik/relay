<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InteractsWithCurrentProject;
use App\Http\Requests\DashboardSendEmailRequest;
use App\Models\Email;
use App\Models\Project;
use App\Services\EmailRetryService;
use App\Services\EmailSendService;
use App\Services\SendingEligibility;
use App\Support\ProjectContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Throwable;

class DashboardEmailController extends Controller
{
    use InteractsWithCurrentProject;

    public function __construct(
        private ProjectContext $projectContext,
        private SendingEligibility $eligibility,
        private EmailRetryService $emailRetry,
        private EmailSendService $emailSendService,
    ) {}

    public function send(DashboardSendEmailRequest $request): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('sendEmail', $project);

        $source = $this->sourceFor($project);

        if (! $this->eligibility->canSend($project, $source)) {
            return $this->redirectToSendSetup($project);
        }

        $email = $this->emailSendService->send($project, $source, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => "Email queued as {$email->public_id}."]);

        return $this->toProjectSection($project, 'activity');
    }

    public function resend(string|Email $projectOrEmail, ?Email $email = null): RedirectResponse
    {
        $email = $email ?? $projectOrEmail;

        abort_unless($email instanceof Email, 404);

        $project = $this->projectFor(Auth::user());
        $this->authorize('sendEmail', $project);

        abort_unless($email->project_id === $project->id, 404);

        $email->load(['recipients', 'source', 'template']);

        if (! $email->source || ! $this->eligibility->canSend($project, $email->source)) {
            return $this->redirectToSendSetup($project);
        }

        try {
            $resent = $this->emailSendService->send($project, $email->source, $this->emailRetry->payloadForRetry($email));
        } catch (Throwable $exception) {
            report($exception);

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Could not resend email: '.$exception->getMessage(),
            ]);

            return $this->toProjectSection($project, 'activity');
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => "Email resent as {$resent->public_id}."]);

        return $this->toProjectSection($project, 'activity');
    }

    public function retrySoftBounces(): RedirectResponse
    {
        $project = $this->projectFor(Auth::user());
        $this->authorize('sendEmail', $project);

        $retried = 0;

        $project->emails()
            ->with(['recipients', 'events', 'source', 'template'])
            ->where('status', 'bounced')
            ->latest()
            ->limit(100)
            ->get()
            ->filter(fn (Email $email) => $this->emailRetry->isSoftBounce($email))
            ->each(function (Email $email) use ($project, &$retried): void {
                if (! $email->source || ! $this->eligibility->canSend($project, $email->source)) {
                    return;
                }

                $this->emailSendService->send($project, $email->source, $this->emailRetry->payloadForRetry($email));
                $retried++;
            });

        Inertia::flash('toast', ['type' => 'success', 'message' => $retried === 1 ? 'Retried 1 soft bounce.' : "Retried {$retried} soft bounces."]);

        return $this->toProjectSection($project, 'bounces');
    }

    private function redirectToSendSetup(Project $project): RedirectResponse
    {
        Inertia::flash('toast', [
            'type' => 'error',
            'message' => 'Connect SES credentials and verify a sending domain before sending real email.',
        ]);

        return $this->toProjectSection($project, 'identities')
            ->withErrors(['send' => 'Connect SES credentials and verify a sending domain before sending real email.']);
    }
}
