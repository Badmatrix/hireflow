import { Link, router } from '@inertiajs/react';
import { Badge, Card, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { BriefcaseBusiness, FileText, Search, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

import AppPagination from '@/shared/components/ui/app-pagination';
import AppTextInput from '@/shared/components/ui/AppTextInput';
import { formatDate } from '@/shared/constant/helper';

import { ApplicationStatus } from '../components/ui/ApplicationStatus';
import type {
    ApplicationStatus as ApplicationStatusType,
    ApplicationsIndexProps,
} from '../types/application';

type StatusCounts = {
    all: number;
    pending: number;
    reviewing: number;
    shortlisted: number;
    rejected: number;
    hired: number;
    withdrawn:number
    
};

type Props = ApplicationsIndexProps & {
    filters: {
        search: string;
        status: ApplicationStatusType | '';
    };
    statusCounts: StatusCounts;
};

export default function EmployerIndex({
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
            '/employer/applications',
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
    }, [debouncedSearch, filters.search, filters.status]);

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

    const hasFilters = Boolean(filters.search || filters.status);

    const getStatusCount = (status: ApplicationStatusType | '') => {
        if (status === '') {
            return statusCounts.all;
        }

        return statusCounts[status];
    };

    const handleStatusChange = (status: ApplicationStatusType | '') => {
        router.get(
            '/employer/applications',
            {
                search: filters.search || undefined,
                status: status || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <Stack gap="xl">
            {/* Header */}
            <Stack gap={4}>
                <Title order={2}>Applications</Title>

                <Text c="dimmed">
                    Review applications submitted to your jobs.
                </Text>
            </Stack>

            {/* Status filters */}
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
                                style={{
                                    cursor: 'pointer',
                                    borderColor: active
                                        ? 'var(--mantine-primary-color-filled)'
                                        : undefined,
                                }}
                                onClick={() => handleStatusChange(item.value)}
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

            {/* Search */}
            <Paper withBorder radius="lg" p="md">
                <AppTextInput
                    label="Search applications"
                    placeholder="Search applicant, job, or company..."
                    leftSection={<Search size={16} />}
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                />
            </Paper>

            {/* Applications */}
            {applications.data.length === 0 ? (
                <Paper withBorder radius="lg" p="xl">
                    <Stack align="center" gap="sm">
                        <BriefcaseBusiness size={36} />

                        <Text fw={600}>
                            {hasFilters
                                ? 'No applications found'
                                : 'No applications yet'}
                        </Text>

                        <Text size="sm" c="dimmed" ta="center">
                            {hasFilters
                                ? 'Try changing your search or filter.'
                                : 'Applications submitted to your jobs will appear here.'}
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
                            <Stack gap="md">
                                {/* Applicant + status */}
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                >
                                    <Group align="flex-start" wrap="nowrap">
                                        <Paper withBorder radius="md" p="sm">
                                            <UserRound size={24} />
                                        </Paper>

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

                                {/* Job */}
                                <Paper withBorder radius="md" p="md">
                                    <Stack gap={4}>
                                        <Text size="sm" c="dimmed">
                                            Applied for
                                        </Text>

                                        <Text
                                            fw={600}
                                            component={Link}
                                            href={`/jobs/${application.job.id}`}
                                            style={{
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {application.job.title}
                                        </Text>

                                        <Text size="sm" c="dimmed">
                                            {application.job.company.name}
                                        </Text>
                                    </Stack>
                                </Paper>

                                {/* Application details */}
                                <Group
                                    justify="space-between"
                                    pt="sm"
                                    style={{
                                        borderTop:
                                            '1px solid var(--mantine-color-default-border)',
                                    }}
                                >
                                    <Group gap="xs">
                                        <FileText size={16} />

                                        <Text size="sm" c="dimmed">
                                            {application.resume?.title ??
                                                'No resume attached'}
                                        </Text>
                                    </Group>

                                    <Text size="sm" c="dimmed">
                                        Applied{' '}
                                        {formatDate(application.applied_at)}
                                    </Text>
                                </Group>

                                {/* View */}
                                <Group justify="flex-end">
                                    <Link
                                        href={`/applications/${application.id}`}
                                        style={{
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <Text size="sm" fw={600} c="blue">
                                            View application →
                                        </Text>
                                    </Link>
                                </Group>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            )}

            <AppPagination data={applications} />
        </Stack>
    );
}
