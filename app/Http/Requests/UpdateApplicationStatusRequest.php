<?php

namespace App\Http\Requests;

use App\Models\Application;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $application = $this->route('application');

        return $this->user()?->can('updateStatus', $application) ?? false;
    }

    public function rules(): array
    {
        /** @var Application $application */
        $application = $this->route('application');

        $allowedTransitions = match ($application->status) {
            Application::STATUS_PENDING => [
                Application::STATUS_REVIEWING,
            ],

            Application::STATUS_REVIEWING => [
                Application::STATUS_SHORTLISTED,
                Application::STATUS_REJECTED,
            ],

            Application::STATUS_SHORTLISTED => [
                Application::STATUS_HIRED,
                Application::STATUS_REJECTED,
            ],

            Application::STATUS_REJECTED,
            Application::STATUS_HIRED,
            Application::STATUS_WITHDRAWN => [],

            default => [],
        };

        return [
            'status' => [
                'required',
                Rule::in($allowedTransitions),
            ],
        ];
    }
}
