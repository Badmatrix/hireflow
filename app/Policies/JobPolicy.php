<?php

namespace App\Policies;

use App\Models\Job;
use App\Models\User;

class JobPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEmployer();
    }

    public function view(User $user, Job $job): bool
    {
        return $user->isAdmin() || (

          $user->isEmployer() && $job->company->user_id === $user->id
        );
    }

    public function create(User $user): bool
    {
        return $user->isEmployer();
    }


    public function update(User $user, Job $job): bool
    {
        return $user->isEmployer()
            && $job->company->user_id === $user->id;
    }

    public function delete(User $user, Job $job): bool
    {
        return $user->isAdmin()
            || (
                $user->isEmployer()
                && $job->company->user_id === $user->id
            );
    }

    public function publish(User $user, Job $job): bool
    {
        return $user->isEmployer()
            && $job->company->user_id === $user->id;
    }
}
