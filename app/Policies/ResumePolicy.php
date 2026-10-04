<?php

namespace App\Policies;

use App\Models\Resume;
use App\Models\User;

class ResumePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isJobSeeker();
    }

    public function view(User $user, Resume $resume): bool
    {
        return $resume->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isJobSeeker();
    }

    public function update(User $user, Resume $resume): bool
    {
        return $resume->user_id === $user->id;
    }

    public function delete(User $user, Resume $resume): bool
    {
        return $resume->user_id === $user->id;
    }
}
