import { Link } from '@inertiajs/react';
import type { InertiaFormProps } from '@inertiajs/react';
import { Group, Stack } from '@mantine/core';
import type {FormEventHandler} from 'react';

import type { Company } from '@/pages/companies/types/company';
import AppForm from '@/shared/components/AppForm';
import AppButton from '@/shared/components/ui/AppButton';
import AppNumberInput from '@/shared/components/ui/AppNumberInput';
import AppSelect from '@/shared/components/ui/AppSelect';
import AppTextarea from '@/shared/components/ui/AppTextarea';
import AppTextInput from '@/shared/components/ui/AppTextInput';

import type { JobFormData } from '../types/job';

type JobFormProps = {
    form: InertiaFormProps<JobFormData>;
    companies?: Company[];
    editing?: boolean;
    companyName?: string;
    onSubmit: FormEventHandler<HTMLFormElement>;
};

const employmentTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' },
];

const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' },
];

export default function JobForm({
    form,
    companies = [],
    editing = false,
    companyName,
    onSubmit,
}: JobFormProps) {
    
    const handleSelectCompany = (value: any) => {
        form.setData('company_id', value );
    };

    return (
        <AppForm
            title={editing ? 'Edit Job' : 'Create Job'}
            maw={800}
            onSubmit={onSubmit}
            actions={
                <>
                    <Link href="/jobs" style={{ textDecoration: 'none' }}>
                        <AppButton variant="default">Cancel</AppButton>
                    </Link>

                    <AppButton type="submit" loading={form.processing}>
                        {editing ? 'Save Changes' : 'Create Job'}
                    </AppButton>
                </>
            }
        >
            <Stack gap="lg">
                {/* Company */}
                {editing ? (
                    <AppTextInput
                        label="Company"
                        value={companyName ?? ''}
                        readOnly
                    />
                ) : (
                    <AppSelect
                        label="Company"
                        placeholder="Select company"
                        searchable
                        clearable
                        required
                        data={companies.map((company) => ({
                            value: String(company.id),
                            label: company.name,
                        }))}
                        value={form.data.company_id}
                        onChange={handleSelectCompany}
                        error={form.errors.company_id}
                    />
                )}

                {/* Job title */}
                <AppTextInput
                    label="Job Title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={form.data.title}
                    onChange={(event) =>
                        form.setData('title', event.currentTarget.value)
                    }
                    error={form.errors.title}
                    required
                />

                {/* Location */}
                <AppTextInput
                    label="Location"
                    placeholder="e.g. Lagos, Nigeria"
                    value={form.data.location}
                    onChange={(event) =>
                        form.setData('location', event.currentTarget.value)
                    }
                    error={form.errors.location}
                    required
                />

                {/* Employment + Experience */}
                <Group grow>
                    <AppSelect
                        label="Employment Type"
                        placeholder="Select employment type"
                        data={employmentTypes}
                        value={form.data.employment_type}
                        onChange={(value) =>
                            form.setData(
                                'employment_type',
                                (value ?? '') as JobFormData['employment_type'],
                            )
                        }
                        error={form.errors.employment_type}
                        required
                    />

                    <AppSelect
                        label="Experience Level"
                        placeholder="Select experience level"
                        data={experienceLevels}
                        value={form.data.experience_level}
                        onChange={(value) =>
                            form.setData(
                                'experience_level',
                                (value ??
                                    '') as JobFormData['experience_level'],
                            )
                        }
                        error={form.errors.experience_level}
                        required
                    />
                </Group>

                {/* Description */}
                <AppTextarea
                    label="Description"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    description="Include responsibilities, requirements, qualifications, and other important information."
                    minRows={8}
                    autosize
                    required
                    value={form.data.description}
                    onChange={(event) =>
                        form.setData('description', event.currentTarget.value)
                    }
                    error={form.errors.description}
                />

                {/* Salary */}
                <Group grow>
                    <AppNumberInput
                        label="Minimum Salary"
                        placeholder="e.g. 300000"
                        min={0}
                        thousandSeparator=","
                        value={form.data.salary_min}
                        onChange={(value) =>
                            form.setData(
                                'salary_min',
                                value === '' ? '' : Number(value),
                            )
                        }
                        error={form.errors.salary_min}
                    />

                    <AppNumberInput
                        label="Maximum Salary"
                        placeholder="e.g. 500000"
                        min={0}
                        thousandSeparator=","
                        value={form.data.salary_max}
                        onChange={(value) =>
                            form.setData(
                                'salary_max',
                                value === '' ? '' : Number(value),
                            )
                        }
                        error={form.errors.salary_max}
                    />
                </Group>

                {/* Closing date */}
                <AppTextInput
                    type="date"
                    label="Closing Date"
                    value={form.data.closing_date}
                    onChange={(event) =>
                        form.setData('closing_date', event.currentTarget.value)
                    }
                    error={form.errors.closing_date}
                />
            </Stack>
        </AppForm>
    );
}
