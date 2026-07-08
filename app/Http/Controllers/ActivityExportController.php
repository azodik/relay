<?php

namespace App\Http\Controllers;

use App\Services\Activity\ActivityPageBuilder;
use App\Support\ProjectContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ActivityExportController extends Controller
{
    public function __construct(private ActivityPageBuilder $pageBuilder) {}

    public function __invoke(Request $request, ProjectContext $context): StreamedResponse
    {
        $projectSlug = $request->route('project');
        $project = $context->projectFor(
            Auth::user(),
            is_string($projectSlug) ? $projectSlug : null,
        );
        $section = (string) $request->query('section', 'activity');
        $emails = $this->pageBuilder->emailsQuery($project, $request, $section)->get();

        return response()->streamDownload(function () use ($emails) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Message ID', 'Status', 'Recipient', 'Subject', 'Template', 'Sent at', 'SES message ID']);

            foreach ($emails as $email) {
                $recipient = $email->recipients->firstWhere('type', 'to');
                fputcsv($handle, [
                    $email->public_id,
                    $email->status,
                    $recipient?->email,
                    $email->subject,
                    $email->template?->slug ?? '',
                    $email->sent_at?->toIso8601String() ?: $email->created_at->toIso8601String(),
                    $email->ses_message_id,
                ]);
            }

            fclose($handle);
        }, 'relay-activity.csv', ['Content-Type' => 'text/csv']);
    }
}
