<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Company;
use App\Models\Job;
use App\Models\User;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->guard()->user();

        return match (true) {
            $user->isAdmin() => $this->adminDashboard(),
            $user->isEmployer() => $this->employerDashboard($user),
            default => $this->jobSeekerDashboard($user),
        };
    }

    private function jobSeekerDashboard(User $user): Response
    {
        $applicationStats = $user->applications()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $applications = $user->applications()
            ->with([
                'job.company',
                'resume',
            ])
            ->latest('applied_at')
            ->limit(5)
            ->get();

        $notifications = $user->unreadNotifications()
            ->latest()
            ->limit(5)
            ->get();

        return inertia('dashboard/pages/Index', [
            'applicationStats' => [
                'total' => $user->applications()->count('*'),
                'pending' => $applicationStats->get('pending', 0),
                'reviewing' => $applicationStats->get('reviewing', 0),
                'shortlisted' => $applicationStats->get('shortlisted', 0),
                'hired' => $applicationStats->get('hired', 0),
                'rejected' => $applicationStats->get('rejected', 0),
                'withdrawn' => $applicationStats->get('withdrawn', 0),
            ],

            'applications' => $applications,

            'notifications' => $notifications,
        ]);
    }

    private function employerDashboard(User $user): Response
    {
        $companies = Company::query()
            ->where('user_id', $user->id);

        $jobs = Job::query()
            ->whereHas('company', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            });

        $applications = Application::query()
            ->whereHas('job.company', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            });

        $applicationStats = (clone $applications)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $recentJobs = (clone $jobs)
            ->with('company')
            ->latest()
            ->limit(5)
            ->get();

        $recentApplications = (clone $applications)
            ->with([
                'user',
                'job.company',
            ])
            ->latest('applied_at')
            ->limit(5)
            ->get();

        return inertia('dashboard/pages/Employer', [
            'stats' => [
                'companies' => $companies->count('*'),
                'jobs' => $jobs->count('*'),
                'publishedJobs' => (clone $jobs)
                    ->where('status', 'published')
                    ->count('*'),
                'applications' => $applications->count('*'),
                'pendingApplications' => $applicationStats->get(
                    'pending',
                    0
                ),
                'shortlistedApplications' => $applicationStats->get(
                    'shortlisted',
                    0
                ),
            ],

            'recentJobs' => $recentJobs,

            'recentApplications' => $recentApplications,
        ]);
    }

    private function adminDashboard(): Response
    {
        $applicationStats = Application::query()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $recentUsers = User::query()
            ->with('role')
            ->latest()
            ->limit(5)
            ->get();

        $recentCompanies = Company::query()
            ->with('user')
            ->latest()
            ->limit(5)
            ->get();

        $recentJobs = Job::query()
            ->with('company')
            ->latest()
            ->limit(5)
            ->get();

        return inertia('dashboard/pages/Admin', [
            'stats' => [
                'users' => User::query()->count('*'),
                'activeUsers' => User::query()
                    ->where('status', 'active')
                    ->count('*'),
                'companies' => Company::query()->count('*'),
                'verifiedCompanies' => Company::query()
                    ->where('is_verified', true)
                    ->count('*'),
                'jobs' => Job::query()->count('*'),
                'publishedJobs' => Job::query()
                    ->where('status', 'published')
                    ->count(),
                'applications' => Application::query()->count('*'),
                'pendingApplications' => $applicationStats->get(
                    'pending',
                    0
                ),
            ],

            'recentUsers' => $recentUsers,
            'recentCompanies' => $recentCompanies,
            'recentJobs' => $recentJobs,
        ]);
    }
}
