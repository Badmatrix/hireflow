<?php

namespace App\Http\Requests;

use App\Models\Application;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isJobSeeker() === true;
    }

    public function rules(): array
    {
        return [
            // 'job_id' => [
            //     'required',
            //     'integer',
            //     Rule::exists('jobs', 'id'),
            //     Rule::unique('applications', 'job_id')
            //         ->where(
            //             fn ($query) => $query->where(
            //                 'user_id',
            //                 $this->user()->id
            //             )
            //         ),
            // ],

            'resume_id' => [
                'nullable',
                'integer',
                Rule::exists('resumes', 'id')
                    ->where(
                        fn ($query) => $query->where(
                            'user_id',
                            $this->user()->id
                        )
                    ),
            ],

            'cover_letter' => [
                'nullable',
                'string',
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $job = $this->route('job');

            if (
                $job &&
                $this->user()
                    ->applications()
                    ->where('job_id', $job->id)
                    ->exists()
            ) {
                $validator->errors()->add(
                    'application',
                    'You have already applied for this job.'
                );
            }
        });
    }

}
