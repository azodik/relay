<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\Activity\ActivityPageBuilder;
use App\Services\SendingEligibility;
use App\Support\ProjectContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function __construct(
        private SendingEligibility $eligibility,
        private ActivityPageBuilder $pageBuilder,
    ) {}

    public function __invoke(Request $request, ProjectContext $context): Response|RedirectResponse
    {
        $user = $request->user();

        abort_unless($user instanceof User, 403);

        $projectSlug = $request->route('project');
        $project = $context->projectFor(
            $user,
            is_string($projectSlug) ? $projectSlug : null,
        );
        $source = $context->currentSource($project);

        $section = (string) $request->route('section', 'activity');

        if ($section === 'send' && (! $source || ! $this->eligibility->canSend($project, $source))) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Connect SES credentials and verify a sending domain before sending real email.',
            ]);

            return redirect($context->sectionPath($project, 'identities'));
        }

        return Inertia::render('Activity', $this->pageBuilder->props(
            $request,
            $user,
            $project,
            $source,
            $context,
            $section,
        ));
    }
}
