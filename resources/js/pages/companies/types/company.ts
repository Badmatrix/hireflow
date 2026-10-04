import type { Job } from '@/pages/jobs/types/job';
import type { User } from '@/types';
import type { PaginatedResponse } from '../../../shared/types/pagination';

export type CompanyJob = {
    id: number;
    title: string;
    slug: string;
    location: string | null;
    employment_type: string;
    experience_level: string;
    salary_min: string | null;
    salary_max: string | null;
    closing_date: string | null;
    status: string;
};

export type Company = {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    logo: string | null;
    website: string | null;
    email: string | null;
    phone: string | null;
    location: string;
    company_type: string;
    slogan: string | null;
    description: string | null;
    is_verified: boolean;
    jobs_count?: number;
    published_jobs_count?: number;
    jobs?: Job[];
    created_at: string;
    updated_at: string;
    user?:User
   
};

export type CompanyFormData = {
    name: string;
    website: string;
    email: string;
    phone: string;
    location: string;
    company_type: string;
    slogan: string;
    description: string;
};

export type BrowseCompaniesProps = {
    companies: PaginatedResponse<Company>;
    filters: {
        search: string;
    };
};
