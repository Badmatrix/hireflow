<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Job>
 */
class JobFactory extends Factory
{
    protected static array $titles = [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Software Engineer',
        'Laravel Developer',
        'React Developer',
        'DevOps Engineer',
        'UI/UX Designer',
        'Product Designer',
        'Product Manager',
        'Data Analyst',
        'Data Scientist',
        'System Analyst',
        'QA Engineer',
        'Mobile App Developer',
        'Cybersecurity Analyst',
        'Cloud Engineer',
        'Technical Support Specialist',
        'Project Manager',
        'Business Analyst',
    ];

    public function definition(): array
    {

        $title = fake()->randomElement(static::$titles);
        Str::slug($title) . '-' . fake()->unique()->numberBetween(1000, 9999);


        $status = fake()->randomElement([
            Job::STATUS_DRAFT,
            Job::STATUS_PUBLISHED,
            Job::STATUS_PUBLISHED,
            Job::STATUS_PUBLISHED,
            Job::STATUS_CLOSED,
        ]);

        return [
            'company_id' => Company::query()->inRandomOrder()->value('id'),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->numberBetween(0100, 9999),
            'description' => fake()->paragraphs(
                fake()->numberBetween(3, 6),
                true
            ),

            'location' => fake()->randomElement([
                'Lagos, Nigeria',
                'Abuja, Nigeria',
                'Port Harcourt, Nigeria',
                'Ibadan, Nigeria',
                'Remote',
                'Hybrid - Lagos, Nigeria',
                'Hybrid - Abuja, Nigeria',
            ]),

            'employment_type' => fake()->randomElement([
                'full-time',
                'part-time',
                'contract',
                'internship',
            ]),

            'experience_level' => fake()->randomElement([
                'entry-level',
                'mid-level',
                'senior-level',
            ]),

            'salary_min' => $salaryMin = fake()->randomElement([
                150000,
                200000,
                250000,
                300000,
                400000,
                500000,
                600000,
            ]),


            'salary_max' => fake()->randomElement([
            $salaryMin + 100000,
            $salaryMin + 200000,
            $salaryMin + 300000,
            ]),

            'status' => $status,

            'closing_date' => $status === Job::STATUS_CLOSED
                ? fake()->dateTimeBetween('-3 months', '-1 day')
                : fake()->dateTimeBetween('+2 weeks', '+3 months'),
        ];
    }
}
