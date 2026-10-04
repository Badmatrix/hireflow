import type { Company } from '@/pages/companies/types/company';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type { User } from '@/types';

export type ApplicationStatus =
    | 'pending'
    | 'reviewing'
    | 'shortlisted'
    | 'rejected'
    | 'hired'
    | 'withdrawn';

export type ApplicationResume = {
    id: number;
    title: string;
    file_name: string;
};

export type ApplicationJob = {
    id: number;
    title: string;
    slug: string;
    location: string | null;
    company: Company;
};
export type ApplicationStatusHistory = {
    id: number;
    application_id: number;
    from_status: ApplicationStatus | null;
    to_status: ApplicationStatus;
    changed_by: { id: number; name: string };
    created_at: string;
    updated_at: string;
};

export type Application = {
    id: number;
    job_id: number;
    user_id: number;
    resume_id: number;
    cover_letter: string | null;
    status: ApplicationStatus;
    applied_at: string;
    created_at: string;
    updated_at: string;

    job: ApplicationJob;
    user: User;
    resume: ApplicationResume | null;
    status_history: ApplicationStatusHistory[];
};

export type ApplicationsIndexProps = {
    applications: PaginatedResponse<Application>;
};
