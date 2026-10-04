<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Company>
 */
class CompanyFactory extends Factory
{
    protected $model = Company::class;

    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'user_id' => User::factory(),

            'name' => $name,

            'slug' => Str::slug($name),

            'logo' => fake()->imageUrl(),

            'website' => fake()->url(),

            'email' => fake()->companyEmail(),

            'phone' => fake()->phoneNumber(),

            'location' => fake()->city(),

            'company_type' => fake()->randomElement([
                'Technology',
                'Finance',
                'Engineering',
                'Healthcare',
                'Education',
                'Marketing',
            ]),
            'slogan' => fake()->catchPhrase(),
            'description' => fake()->paragraph(),
            'is_verified' => true,
        ];
    }
}
