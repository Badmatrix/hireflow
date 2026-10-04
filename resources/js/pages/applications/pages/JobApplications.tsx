import { Link, router } from '@inertiajs/react';
import {
    Avatar,
    Badge,
    Card,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Eye, FileText, Search, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

import AppPagination from '@/shared/components/ui/app-pagination';
import AppBack from '@/shared/components/ui/AppBack';
import AppButton from '@/shared/components/ui/AppButton';
import AppTextInput from '@/shared/components/ui/AppTextInput';
import { formatDate } from '@/shared/constant/helper';
import type { PaginatedResponse } from '@/shared/types/pagination';

import { ApplicationStatus } from '../components/ui/ApplicationStatus';
import type {
    Application,
    ApplicationJob,
    ApplicationStatus as ApplicationStatusType,
} from '../types/application';

type StatusCounts = {
    all: number;
    pending: number;
    reviewing: number;
    shortlisted: number;
    rejected: number;
    hired: number;
    withdrawn?: number;
};

type Props = {
    job: ApplicationJob;
    applications: PaginatedResponse<Application>;
    filters: {
        search: string;
        status: ApplicationStatusType | '';
    };
    statusCounts: StatusCounts;
};

const statusFilters: {
    label: string;
    value: ApplicationStatusType | '';
}[] = [
    {
        label: 'All',
        value: '',
    },
    {
        label: 'Pending',
        value: 'pending',
    },
    {
        label: 'Reviewing',
        value: 'reviewing',
    },
    {
        label: 'Shortlisted',
        value: 'shortlisted',
    },
    {
        label: 'Rejected',
        value: 'rejected',
    },
    {
        label: 'Hired',
        value: 'hired',
    },
   
];

export default function JobApplications({
    job,
    applications,
    filters,
    statusCounts,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const [debouncedSearch] = useDebouncedValue(search, 500);

    useEffect(() => {
        if (debouncedSearch === filters.search) {
            return;
        }

        router.get(
            `/jobs/${job.id}/applications`,
            {
                search: debouncedSearch || undefined,
                status: filters.status || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, filters.search, filters.status, job.id]);

    // const handleStatusChange = (value: string | null) => {
    //     router.get(
    //         `/jobs/${job.id}/applications`,
    //         {
    //             search: search || undefined,
    //             status: value || undefined,
    //         },
    //         {
    //             preserveState: true,
    //             preserveScroll: true,
    //             replace: true,
    //         },
    //     );
    // };

    const handleStatusFilter = (value: ApplicationStatusType | '') => {
        router.get(
            `/jobs/${job.id}/applications`,
            {
                search: filters.search || undefined,
                status: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const getStatusCount = (status: ApplicationStatusType | '') => {
        if (status === '') {
            return statusCounts.all;
        }

        return statusCounts[status];
    };

    return (
        <Stack gap="xl">
            {/* Header */}
            <Stack gap={4}>
                <AppBack href={`/jobs/${job.id}`} to="Jobs" />

                <Group justify="space-between" align="flex-end">
                    <Stack gap={4}>
                        <Title order={2}>Applications</Title>

                        <Text c="dimmed">
                            {job.title} · {job.company.name}
                        </Text>
                    </Stack>

                    <Text size="sm" c="dimmed">
                        {applications.total}{' '}
                        {applications.total === 1
                            ? 'application'
                            : 'applications'}
                    </Text>
                </Group>
            </Stack>

            {/* Status Pipeline */}
            <Paper withBorder radius="lg" p="md">
                <Group gap="xs" wrap="wrap">
                    {statusFilters.map((item) => {
                        const active = filters.status === item.value;

                        return (
                            <Paper
                                key={item.value || 'all'}
                                withBorder
                                px="md"
                                py="xs"
                                radius="md"
                                onClick={() => handleStatusFilter(item.value)}
                                style={{
                                    cursor: 'pointer',
                                    transition:
                                        'border-color 150ms ease, background-color 150ms ease',
                                    borderColor: active
                                        ? 'var(--mantine-primary-color-filled)'
                                        : undefined,
                                    backgroundColor: active
                                        ? 'var(--mantine-color-default-hover)'
                                        : undefined,
                                }}
                            >
                                <Group gap="xs">
                                    <Text size="sm" fw={active ? 700 : 500}>
                                        {item.label}
                                    </Text>

                                    <Badge
                                        variant={active ? 'filled' : 'light'}
                                    >
                                        {getStatusCount(item.value)}
                                    </Badge>
                                </Group>
                            </Paper>
                        );
                    })}
                </Group>
            </Paper>

            {/* Filters */}
            <Paper withBorder radius="lg" p="md">
                <Group align="flex-end">
                    <AppTextInput
                        flex={1}
                        label="Search applicants"
                        placeholder="Search by name or email..."
                        leftSection={<Search size={16} />}
                        value={search}
                        onChange={(event) =>
                            setSearch(event.currentTarget.value)
                        }
                    />

                    {/* <AppSelect
                        w={180}
                        label="Status"
                        placeholder="All statuses"
                        clearable
                        value={filters.status || null}
                        onChange={handleStatusChange}
                        data={[
                            {
                                value: 'pending',
                                label: 'Pending',
                            },
                            {
                                value: 'reviewing',
                                label: 'Reviewing',
                            },
                            {
                                value: 'shortlisted',
                                label: 'Shortlisted',
                            },
                            {
                                value: 'rejected',
                                label: 'Rejected',
                            },
                            {
                                value: 'hired',
                                label: 'Hired',
                            },
                        ]}
                    /> */}
                </Group>
            </Paper>

            {/* Applications */}
            {applications.data.length === 0 ? (
                <Paper withBorder radius="lg" p="xl">
                    <Stack align="center" gap="sm">
                        <UserRound size={36} />

                        <Text fw={600}>
                            {filters.search || filters.status
                                ? 'No applications found'
                                : 'No applications yet'}
                        </Text>

                        <Text size="sm" c="dimmed">
                            {filters.search || filters.status
                                ? 'Try changing your search or filter.'
                                : 'No one has applied for this job.'}
                        </Text>
                    </Stack>
                </Paper>
            ) : (
                <Stack gap="md">
                    {applications.data.map((application) => (
                        <Card
                            key={application.id}
                            withBorder
                            radius="lg"
                            padding="lg"
                        >
                            {/* Applicant */}
                            <Group justify="space-between" align="flex-start">
                                <Group align="flex-start" wrap="nowrap">
                                    <Avatar
                                        radius="xl"
                                        src={application.user.avatar}
                                        name={application.user.name}
                                    >
                                        <UserRound size={20} />
                                    </Avatar>

                                    <Stack gap={4}>
                                        <Text fw={600}>
                                            {application.user.name}
                                        </Text>

                                        <Text size="sm" c="dimmed">
                                            {application.user.email}
                                        </Text>
                                    </Stack>
                                </Group>

                                <ApplicationStatus
                                    status={application.status}
                                />
                            </Group>

                            {/* Resume + Review */}
                            <Group
                                mt="lg"
                                pt="md"
                                justify="space-between"
                                align="center"
                                style={{
                                    borderTop:
                                        '1px solid var(--mantine-color-default-border)',
                                }}
                            >
                                <Group gap="xs">
                                    <FileText size={16} />

                                    {application.resume ? (
                                        <Text size="sm">
                                            {application.resume.file_name}
                                        </Text>
                                    ) : (
                                        <Text size="sm" c="dimmed">
                                            No resume
                                        </Text>
                                    )}

                                    <Text size="sm" c="dimmed">
                                        · Applied{' '}
                                        {formatDate(application.applied_at)}
                                    </Text>
                                </Group>

                                <Link href={`/applications/${application.id}`}>
                                    <AppButton
                                        variant="light"
                                        size="sm"
                                        leftSection={<Eye size={16} />}
                                    >
                                        Review
                                    </AppButton>
                                </Link>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}

            {/* Pagination */}
            <AppPagination data={applications} />
        </Stack>
    );
}
