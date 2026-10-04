<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isEmployer() === true;
    }

    public function rules(): array
    {
        return [
            'company_id' => [
                'required',
                'integer',
                Rule::exists('companies', 'id')
                    ->where(function ($query) {
                        $query->where(
                            'user_id',
                            $this->user()->id
                        );
                    }),
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
            ],

            'location' => [
                'required',
                'string',
                'max:255',
            ],
            
            'employment_type' => [
                'required',
                'string',
                Rule::in([
                    'full-time',
                    'part-time',
                    'contract',
                    'internship',
                    'temporary',
                ]),
            ],
            
            'experience_level' => [
                'required',
                'string',
                Rule::in([
                    'entry',
                    'mid',
                    'senior',
                    'lead',
                    'executive',
                ]),
            ],

            'salary_min' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'salary_max' => [
                'nullable',
                'numeric',
                'gte:salary_min',
            ],

            'closing_date' => [
                'nullable',
                'date',
                'after_or_equal:today',
            ],
        ];
    }
}
