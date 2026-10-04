import { Head, Link, router } from '@inertiajs/react';
import { Group, Paper, Stack, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import ConfirmationModal from '@/shared/components/feedback/AppModal';
import AppPagination from '@/shared/components/ui/app-pagination';
import AppButton from '@/shared/components/ui/AppButton';
import AppSelect from '@/shared/components/ui/AppSelect';
import AppTable from '@/shared/components/ui/AppTable';
import type { AppTableColumn } from '@/shared/components/ui/AppTable';
import AppTextInput from '@/shared/components/ui/AppTextInput';
import { formatDate, formatSalary } from '@/shared/constant/helper';
import type { PaginatedResponse } from '@/shared/types/pagination';

import JobAction from '../components/ui/JobAction';
import { JobStatus } from '../components/ui/JobStatus';
import type { Job } from '../types/job';

type JobsIndexProps = {
    jobs: PaginatedResponse<Job>;
    isAdmin: boolean;
    isEmployer: boolean;

    filters: {
        search?: string;
        status?: string;
        sort?: string | null;
        direction?: 'asc' | 'desc';
    };
};

export default function Index({
    jobs,
    isAdmin,
    isEmployer,
    filters,
}: JobsIndexProps) {
    const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [debouncedSearch] = useDebouncedValue(search, 500);

    useEffect(() => {
        if (debouncedSearch === (filters.search ?? '')) {
            return;
        }

        router.get(
            '/jobs',
            {
                search: debouncedSearch || undefined,
                status: filters.status || undefined,
                sort: filters.sort || undefined,
                direction: filters.direction || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [
        debouncedSearch,
        filters.search,
        filters.status,
        filters.sort,
        filters.direction,
    ]);

    const handleDelete = () => {
        if (!jobToDelete) {
            return;
        }

        setDeleting(true);

        router.delete(`/jobs/${jobToDelete.id}`, {
            preserveScroll: true,

            onFinish: () => {
                setDeleting(false);
                setJobToDelete(null);
            },
        });
    };

    const handleStatusChange = (status: string | null) => {
        router.get(
            '/jobs',
            {
                search: search || undefined,
                status: status || undefined,
                sort: filters.sort || undefined,
                direction: filters.direction || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const columns: AppTableColumn<Job>[] = [
        {
            key: 'title',
            label: 'Job',
            sortable: true,
            sortKey: 'title',

            render: (job) => (
                <Stack gap={2}>
                    <Text fw={600}>{job.title}</Text>

                    <Text size="xs" c="dimmed">
                        {job.company.name}
                    </Text>
                </Stack>
            ),
        },

        {
            key: 'salary',
            label: 'Salary',

            render: (job) => <Text size="sm">{formatSalary(job)}</Text>,
        },

        {
            key: 'status',
            label: 'Status',
            sortable: true,
            sortKey: 'status',

            render: (job) => <JobStatus status={job.status} />,
        },

        {
            key: 'closing_date',
            label: 'Closing Date',
            sortable: true,
            sortKey: 'closing_date',

            render: (job) => (
                <Text size="sm">
                    {job.closing_date
                        ? formatDate(job.closing_date)
                        : 'No deadline'}
                </Text>
            ),
        },

        {
            key: 'actions',
            label: 'Actions',
            align: 'right',

            render: (job) => (
                <Group justify="flex-end" gap={4}>
                    <JobAction job={job} isAdmin={isAdmin} />
                </Group>
            ),
        },
    ];

    return (
        <>
            <Head title="Jobs" />
            <Stack gap="xl">
                {/* Header */}

                <Group justify="space-between">
                    <Stack gap={4}>
                        <Text size="xl" fw={700}>
                            {isAdmin ? 'Jobs' : 'My Jobs'}
                        </Text>

                        <Text size="sm" c="dimmed">
                            {isAdmin
                                ? 'Manage jobs posted by companies on HireFlow.'
                                : 'Manage jobs posted by your companies.'}
                        </Text>
                    </Stack>

                    {isEmployer && (
                        <Link
                            href="/jobs/create"
                            style={{
                                textDecoration: 'none',
                            }}
                        >
                            <AppButton leftSection={<Plus size={16} />}>
                                Create Job
                            </AppButton>
                        </Link>
                    )}
                </Group>
                <Paper p="md" withBorder radius="lg">
                    <Group align="flex-end">
                        <AppTextInput
                            label={'search'}
                            flex={1}
                            value={search}
                            onChange={(event) =>
                                setSearch(event.currentTarget.value)
                            }
                            leftSection={<Search size={16} />}
                            placeholder="Search jobs..."
                        />

                        <AppSelect
                            w={180}
                            label="Status"
                            placeholder="All statuses"
                            clearable
                            value={filters.status || null}
                            onChange={handleStatusChange}
                            data={[
                                {
                                    value: 'draft',
                                    label: 'Draft',
                                },
                                {
                                    value: 'published',
                                    label: 'Published',
                                },
                                {
                                    value: 'closed',
                                    label: 'Closed',
                                },
                            ]}
                        />
                    </Group>
                </Paper>
                {/* Jobs Table */}

                <Paper
                    withBorder
                    radius="lg"
                    style={{
                        overflow: 'hidden',
                    }}
                >
                    <AppTable
                        data={jobs.data}
                        columns={columns}
                        getRowKey={(job) => job.id}
                        sort={filters.sort}
                        direction={filters.direction}
                        minWidth={900}
                        queryParams={{
                            search: filters.search || undefined,
                            status: filters.status || undefined,
                        }}
                        emptyTitle="No jobs found"
                        emptyMessage={
                            filters.search || filters.status
                                ? 'Try changing your search or filters.'
                                : 'There are no jobs to display.'
                        }
                    />
                </Paper>

                <AppPagination data={jobs} />
            </Stack>

            <ConfirmationModal
                opened={jobToDelete !== null}
                onClose={() => {
                    if (!deleting) {
                        setJobToDelete(null);
                    }
                }}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete job"
                confirmLabel="Delete"
                confirmColor="red"
                description={
                    <>
                        Are you sure you want to delete{' '}
                        <Text component="span" fw={700}>
                            {jobToDelete?.title}
                        </Text>
                        ? This action cannot be undone.
                    </>
                }
            />
        </>
    );
}
