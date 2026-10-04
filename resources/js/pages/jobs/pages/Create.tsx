import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import type { Company } from '@/pages/companies/types/company';

import JobForm from '../components/JobForm';
import type { JobFormData } from '../types/job';

type CreateJobProps = {
    companies: Company[];
};

export default function Create({ companies }: CreateJobProps) {
    const form = useForm<JobFormData>({
        company_id: '',
        title: '',
        description: '',
        location: '',
        employment_type: '',
        experience_level: '',
        salary_min: '',
        salary_max: '',
        closing_date: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post('/jobs');
      
    };

    return <JobForm form={form} companies={companies} onSubmit={submit} />;
}
