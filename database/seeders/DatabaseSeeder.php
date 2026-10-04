<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Job;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);
        $adminRole = Role::query()->where('name', '=', 'admin')->firstOrFail();
        $employerRole = Role::query()->where('name', '=', 'employer')->firstOrFail();
        $jobSeekerRole = Role::query()->where('name', '=', 'job seeker')->firstOrFail();
        
        $admin = User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('test123'),
             'role_id' => $adminRole->id,
        ]);

        $employer = User::factory()->create([
            'name' => 'Test Employer',
            'email' => 'employer@example.com',
            'password' => Hash::make('test123'),
             'role_id' => $employerRole->id,
            
        ]);

        // $jobSeeker = User::factory()->create([
        //     'name' => 'Test marriot',
        //     'email' => 'marriot@example.com',
        //     'password' => Hash::make('test123'),
        //     'role_id' => $employerRole->id,

        // ]);

        // Create companies owned by the employer.

        $companies = Company::factory(3)
            ->for($employer)
            ->create();

        // Create jobs belonging to those companies.
        $companies->each(function (Company $company) {
            Job::factory(fake()->numberBetween(3, 5))
                ->for($company)
                ->create();
        });
    }
}
