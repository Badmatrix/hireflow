<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationStatusRequest;
use App\Http\Requests\WithdrawApplicationRequest;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Notifications\ApplicationStatusUpdated;

class ApplicationController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response|RedirectResponse
    {
        $user = auth()->guard()->user();

        // if (!$user->isJobSeeker()) {
        //     return redirect()->route('jobs.index');
        // }

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $allowedStatuses = [
            Application::STATUS_PENDING,
            Application::STATUS_REVIEWING,
            Application::STATUS_SHORTLISTED,
            Application::STATUS_REJECTED,
            Application::STATUS_HIRED,
            Application::STATUS_WITHDRAWN,
        ];
        $statusCounts = [
            'all' => $user->applications()->count(),
            'pending' => $user->applications()
                ->where('status', Application::STATUS_PENDING)
                ->count(),
            'reviewing' => $user->applications()
                ->where('status', Application::STATUS_REVIEWING)
                ->count(),
            'shortlisted' => $user->applications()
                ->where('status', Application::STATUS_SHORTLISTED)
                ->count(),
            'rejected' => $user->applications()
                ->where('status', Application::STATUS_REJECTED)
                ->count(),
            'hired' => $user->applications()
                ->where('status', Application::STATUS_HIRED)
                ->count(),
            'withdrawn' => $user->applications()
                ->where('status', Application::STATUS_WITHDRAWN)
                ->count(),
        ];
        if (!in_array($status, $allowedStatuses, true)) {
            $status = '';
        }

        $applications = $user
            ->applications()
            ->with([
                'job.company',
                'resume',
            ])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('job', function ($jobQuery) use ($search) {
                    $jobQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhereHas('company', function ($companyQuery) use ($search) {
                            $companyQuery->where(
                                'name',
                                'like',
                                "%{$search}%"
                            );
                        });
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest('applied_at')
            ->paginate(10)
            ->withQueryString();

        return inertia('applications/pages/Index', [
            'applications' => $applications,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statusCounts' => $statusCounts,
        ]);
    }


    public function employerIndex(Request $request): Response
    {
        $user = $request->user();

        abort_unless($user->isEmployer(), 403);

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $allowedStatuses = [
            Application::STATUS_PENDING,
            Application::STATUS_REVIEWING,
            Application::STATUS_SHORTLISTED,
            Application::STATUS_REJECTED,
            Application::STATUS_HIRED,
        ];

        if (! in_array($status, $allowedStatuses, true)) {
            $status = '';
        }

        /*
        |--------------------------------------------------------------------------
        | Applications belonging to this employer
        |--------------------------------------------------------------------------
        |
        | Employer can own multiple companies, so we scope applications through:
        |
        | Application -> Job -> Company -> user_id
        |
        */

        $applicationsQuery = Application::query()
            ->whereHas('job.company', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            });

        $statusCounts = (clone $applicationsQuery)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $applications = (clone $applicationsQuery)
            ->with([
                'user',
                'job.company',
                'resume',
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->whereHas('user', function ($userQuery) use ($search) {
                            $userQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('job', function ($jobQuery) use ($search) {
                            $jobQuery
                                ->where('title', 'like', "%{$search}%")
                                ->orWhereHas('company', function ($companyQuery) use ($search) {
                                    $companyQuery->where(
                                        'name',
                                        'like',
                                        "%{$search}%"
                                    );
                                });
                        });
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest('applied_at')
            ->paginate(10)
            ->withQueryString();

        return inertia('applications/pages/EmployerIndex', [
            'applications' => $applications,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statusCounts' => [
                'all' => $applicationsQuery->count(),
                'pending' => $statusCounts->get(
                    Application::STATUS_PENDING,
                    0
                ),
                'reviewing' => $statusCounts->get(
                    Application::STATUS_REVIEWING,
                    0
                ),
                'shortlisted' => $statusCounts->get(
                    Application::STATUS_SHORTLISTED,
                    0
                ),
                'rejected' => $statusCounts->get(
                    Application::STATUS_REJECTED,
                    0
                ),
                'hired' => $statusCounts->get(
                    Application::STATUS_HIRED,
                    0
                ),
            ],
        ]);
    }
    public function show(Application $application): Response
    {
        $this->authorize('view', $application);

        $application->load([
            'user.role',
            'job.company',
            'resume',
            'statusHistory.changedBy',
        ]);

        $user = auth()->guard()->user();

        return inertia('applications/pages/Show', [
            'application' => $application,
            'isAdmin' => $user->isAdmin(),
            'isEmployer' => $user->isEmployer(),
            'isJobSeeker' => $user->isJobSeeker(),
            'canUpdateStatus' => $user->can(
                'updateStatus',
                $application
            ),
        ]);
    }

    public function jobApplications(Request $request, Job $job): Response
    {
        $job->load('company');

        $user = auth()->guard()->user();

        abort_unless(
            $user->isAdmin() ||
            (
                $user->isEmployer() &&
                $job->company->user_id === $user->id
            ),
            403
        );

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $allowedStatuses = [
            Application::STATUS_PENDING,
            Application::STATUS_REVIEWING,
            Application::STATUS_SHORTLISTED,
            Application::STATUS_REJECTED,
            Application::STATUS_HIRED,
        ];

        if (!in_array($status, $allowedStatuses, true)) {
            $status = '';
        }

        $statusCounts = $job->applications()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $applications = $job->applications()
            ->with([
                'user',
                'resume',
            ])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest('applied_at')
            ->paginate(10)
            ->withQueryString();

        return inertia('applications/pages/JobApplications', [
            'job' => $job,
            'applications' => $applications,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'statusCounts' => [
                'all' => $job->applications()->count(),
                'pending' => $statusCounts->get(Application::STATUS_PENDING, 0),
                'reviewing' => $statusCounts->get(Application::STATUS_REVIEWING, 0),
                'shortlisted' => $statusCounts->get(Application::STATUS_SHORTLISTED, 0),
                'rejected' => $statusCounts->get(Application::STATUS_REJECTED, 0),
                'hired' => $statusCounts->get(Application::STATUS_HIRED, 0),
            ],
        ]);
    }

    public function create(Job $job): Response|RedirectResponse
    {
        abort_unless(
            auth()->guard()->user()?->isJobSeeker(),
            403
        );

        abort_unless(
            $job->status === Job::STATUS_PUBLISHED,
            404
        );

        abort_unless(
            $job->company->is_verified,
            404
        );

        abort_unless(
            $job->closing_date === null ||
            $job->closing_date->isToday() ||
            $job->closing_date->isFuture(),
            404
        );

        $user = auth()->guard()->user();

        $alreadyApplied = $user
            ->applications()
            ->where('job_id', $job->id)
            ->exists();

        if ($alreadyApplied) {
            return redirect()
                ->route('jobs.browse.show', $job)
                ->with(
                    'error',
                    'You have already applied for this job.'
                );
        }


        $resumes = $user
            ->resumes()
            ->latest()
            ->get([
                'id',
                'title',
                'file_name',
                'is_default',
            ]);


        return inertia('applications/pages/Create', [
            'job' => $job->load('company'),
            'resumes' => $resumes,
        ]);
    }

    public function store(
        StoreApplicationRequest $request,
        Job $job
    ): RedirectResponse {
        $validated = $request->validated();

        DB::transaction(function () use (
            $request,
            $job,
            $validated
        ) {
            $application = Application::create([
                'job_id' => $job->id,
                'user_id' => $request->user()->id,
                'resume_id' => $validated['resume_id'] ?? null,
                'cover_letter' => $validated['cover_letter'] ?? null,
                'status' => Application::STATUS_PENDING,
                'applied_at' => now(),
            ]);

            // Record the initial application status.
            $application->statusHistory()->create([
                'from_status' => null,
                'to_status' => Application::STATUS_PENDING,
                'changed_by' => $request->user()->id,
            ]);
        });

        return redirect()
            ->route('applications.index')
            ->with(
                'success',
                'Application submitted successfully.'
            );
    }

    public function resume(
        Application $application
    ): StreamedResponse {
        $this->authorize('viewResume', $application);

        $application->load('resume');

        abort_unless($application->resume, 404);

        $resume = $application->resume;

        abort_unless(
            Storage::disk('private')->exists($resume->file_path),
            404
        );

        return Storage::disk('private')->response(
            $resume->file_path,
            $resume->file_name,
            [
                'Content-Type' => $resume->file_type,
                'Content-Disposition' => 'inline; filename="' .
                    addslashes($resume->file_name) .
                    '"',
            ]
        );

    }

    public function updateStatus(
        UpdateApplicationStatusRequest $request,
        Application $application
    ): RedirectResponse {
        $this->authorize('updateStatus', $application);

        $newStatus = $request->validated('status');
        $oldStatus = $application->status;

        DB::transaction(function () use (
            $application,
            $oldStatus,
            $newStatus,
            $request,
        ) {
            $application->update([
                'status' => $newStatus,
            ]);

            $application->statusHistory()->create([
                'from_status' => $oldStatus,
                'to_status' => $newStatus,
                'changed_by' => $request->user()->id,
            ]);
        });

        $application->load([
            'job.company',
        ]);

        $application->user->notify(
            new ApplicationStatusUpdated(
                $application,
                $oldStatus,
                $newStatus
            )
        );

        return back()->with(
            'success',
            'Application status updated successfully.'
        );
    }


    public function withdraw(
        WithdrawApplicationRequest $request,
        Application $application
    ): RedirectResponse {
        $this->authorize('withdraw', $application);

        $oldStatus = $application->status;

        DB::transaction(function () use (
            $application,
            $oldStatus,
            $request
        ) {
            $application->update([
                'status' => Application::STATUS_WITHDRAWN,
            ]);

            $application->statusHistory()->create([
                'from_status' => $oldStatus,
                'to_status' => Application::STATUS_WITHDRAWN,
                'changed_by' => $request->user()->id,
            ]);
        });

        return redirect()
            ->route('applications.index')
            ->with(
                'success',
                'Application withdrawn successfully.'
            );
    }
}
