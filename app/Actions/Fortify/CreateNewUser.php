<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;
    use ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param array<string, string> $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'account_type' => ['required', 'string', 'in:job_seeker,employer'],
            'password' => $this->passwordRules(),
        ])->validate();

        $roleName = $input['account_type'] === 'employer'
            ? 'employer'
            : 'job seeker';

        $role = Role::query()
            ->where('name', $roleName)
            ->firstOrFail();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role_id' => $role->id,
            'employer_status' => $input['account_type'] === 'employer'
                ? 'pending'
                : null,
        ]);
    }
}
