<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;

class CompanyPolicy
{
    /**
     * Determine whether the user can view any companies.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEmployer();
    }

    /**
     * Determine whether the user can view a specific company.
     */
    public function view(User $user, Company $company): bool
    {
        return $user->isAdmin()
            || (
                $user->isEmployer()
                && $company->user_id === $user->id
            );
    }


    /**
     * Determine whether the user can create a company.
     */
    public function create(User $user): bool
    {
        return $user->isEmployer() ;
    }

    /**
     * Determine whether the user can update a company.
     */
    public function update(User $user, Company $company): bool
    {
        return $user->isEmployer() && $company->user_id === $user->id;
            
    }

    /**
     * Determine whether the user can delete a company.
     */
    public function delete(User $user, Company $company): bool
    {
        return $user->isAdmin() || (
            $user->isEmployer() && $company->user_id === $user->id
        );
    }

    /**
     * Determine whether the user can verify a company.
     */
    public function verify(User $user, Company $company): bool
    {
        return $user->isAdmin();
    }
}
