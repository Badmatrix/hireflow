<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function view(
        User $user,
        Application $application
    ): bool {
        // Admin can view any application
        if ($user->isAdmin()) {
            return true;
        }

        // Job seeker can view only their own application
        if ($user->isJobSeeker()) {
            return true;
        }

        // Employer can view applications for their company's jobs
        return $user->isEmployer()
            && $application->job->company->user_id === $user->id;
    }

    public function viewResume(
        User $user,
        Application $application
    ): bool {
        return $this->view($user, $application);
    }


    public function updateStatus(
        User $user,
        Application $application
    ): bool {

        return $user->isEmployer()
            && $application->job->company->user_id === $user->id;
    }
    
    public function withdraw(
        User $user,
        Application $application
    ): bool {
        return $user->isJobSeeker()
            && $application->user_id === $user->id
            && in_array($application->status, [
                Application::STATUS_PENDING,
                Application::STATUS_REVIEWING,
            ], true);
    }
}
