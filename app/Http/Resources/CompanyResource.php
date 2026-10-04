<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'logo' => $this->logo,
            'website' => $this->website,
            'location' => $this->location,
            'company_type' => $this->company_type,
            'slogan' => $this->slogan,
            'description' => $this->description,
            'is_verified' => $this->is_verified,
            'jobs_count' => $this->whenCounted('jobs'),
            'created_at' => $this->created_at,
        ];
    }
}
