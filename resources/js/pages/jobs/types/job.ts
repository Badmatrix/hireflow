import type { Company } from '@/pages/companies/types/company';
import type { PaginatedResponse } from '@/shared/types/pagination';

export type JobStatus = 'draft' | 'published' | 'closed';
export type EmploymentType =
    'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary';

export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

export type Job = {
    id: number;
    company_id: number;
    title: string;
    slug: string;
    description: string;
    location: string | null;
    employment_type: EmploymentType;
    experience_level: ExperienceLevel;
    salary_min: string | null;
    salary_max: string | null;
    status: JobStatus;
    closing_date: string | null;
    company: Company;
    created_at: string;
    updated_at: string;
};

export type JobFormData = {
    company_id: string;
    title: string;
    description: string;
    location: string;
    employment_type: EmploymentType | '';
    experience_level: ExperienceLevel | '';
    salary_min: number | '';
    salary_max: number | '';
    closing_date: string;
};
export type BrowseJobsProps = {
    jobs: PaginatedResponse<Job>;
};