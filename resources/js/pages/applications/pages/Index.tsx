import { Link, router } from '@inertiajs/react';
import {
    Badge,
    Card,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
    BriefcaseBusiness,
    FileText,
    Search,
} from 'lucide-react';
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
    withdrawn: number;
};

type Props = ApplicationsIndexProps & {
    filters: {
        search: string;
        status: ApplicationStatusType | '';
    };
    statusCounts: StatusCounts;
};

export default function Index({
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
            '/applications',
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

    // const handleStatusChange = (value: string | null) => {
    //     router.get(
    //         '/applications',
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
        {
            label: 'Withdrawn',
            value: 'withdrawn',
        },
    ];

    const hasFilters = Boolean(filters.search || filters.status);
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
                <Title order={2}>My Applications</Title>

                <Text c="dimmed">Track the jobs you have applied for.</Text>
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
                                onClick={() => {
                                    router.get(
                                        '/applications',
                                        {
                                            search: filters.search || undefined,
                                            status: item.value || undefined,
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true,
                                        },
                                    );
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

            {/* Search */}
            <Paper withBorder radius="lg" p="md">
                <Group align="flex-end">
                    <AppTextInput
                        flex={1}
                        label="Search applications"
                        placeholder="Search by job title or company..."
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
                            {
                                value: 'withdrawn',
                                label: 'Withdrawn',
                            },
                        ]}
                    /> */}
                </Group>
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
                                : "You haven't applied for any jobs yet."}
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
                            <Group justify="space-between" align="flex-start">
                                <Group align="flex-start" wrap="nowrap">
                                    <Paper withBorder radius="md" p="sm">
                                        <BriefcaseBusiness size={24} />
                                    </Paper>

                                    <Stack gap={4}>
                                        <Text
                                            fw={600}
                                            component={Link}
                                            href={`/jobs/browse/${application.job?.slug}`}
                                            style={{
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {application.job.title}
                                        </Text>

                                        <Text size="sm" c="dimmed">
                                            {application.job.company.name}
                                        </Text>

                                        {application.job.location && (
                                            <Text size="sm" c="dimmed">
                                                {application.job.location}
                                            </Text>
                                        )}
                                    </Stack>
                                </Group>

                                <ApplicationStatus
                                    status={application.status}
                                />
                            </Group>

                            <Group
                                mt="lg"
                                pt="md"
                                style={{
                                    borderTop:
                                        '1px solid var(--mantine-color-default-border)',
                                }}
                                justify="space-between"
                            >
                                <Group gap="xs">
                                    <FileText size={16} />

                                    <Text size="sm" c="dimmed">
                                        {application.resume?.title ??
                                            'No resume attached'}
                                    </Text>
                                </Group>

                                <Text size="sm" c="dimmed">
                                    Applied {formatDate(application.applied_at)}
                                </Text>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}

            <AppPagination data={applications} />
        </Stack>
    );
}

