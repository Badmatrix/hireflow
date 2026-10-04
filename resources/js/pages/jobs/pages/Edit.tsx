import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import JobForm from '../components/JobForm';
import type { Job, JobFormData } from '../types/job';

type EditJobProps = {
    job: Job;
};

export default function Edit({ job }: EditJobProps) {
    const form = useForm<JobFormData>({
        company_id: String(job.company_id),
        title: job.title,
        description: job.description,
        location: job.location ?? '',
        employment_type: job.employment_type,
        experience_level: job.experience_level,
        salary_min: job.salary_min !== null ? Number(job.salary_min) : '',
        salary_max: job.salary_max !== null ? Number(job.salary_max) : '',
        closing_date: job.closing_date ? job.closing_date.substring(0, 10) : '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.put(`/jobs/${job.id}`);
    };

    return (
        <JobForm
            form={form}
            editing
            companyName={job.company.name}
            onSubmit={submit}
        />
    );
}
