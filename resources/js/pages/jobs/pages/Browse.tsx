import { Link, router } from '@inertiajs/react';
import {
    Card,
    Grid,
    Group,
    Pagination,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    MapPin,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { formatDate, formatSalary } from '@/shared/constant/helper';
import type { PaginatedResponse } from '@/shared/types/pagination';

import type { Job } from '../types/job';

type BrowseJobsProps = {
    jobs: PaginatedResponse<Job>;
    filters: {
        search: string;
    };
};

export default function JobBrowse({ jobs, filters }: BrowseJobsProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const [debouncedSearch] = useDebouncedValue(search, 500);

    useEffect(() => {
        if (debouncedSearch === filters.search) {
            return;
        }

        router.get(
            '/jobs/browse',
            {
                search: debouncedSearch || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, filters.search]);

    return (
        <Stack gap="xl">
            {/* Header */}
            <Stack gap={4}>
                <Title order={2}>Find Jobs</Title>

                <Text c="dimmed">
                    Discover opportunities from verified companies on HireFlow.
                </Text>
            </Stack>

            {/* Search */}
            <Paper withBorder radius="lg" p="md">
                <TextInput
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Search jobs, companies, locations..."
                    leftSection={<Search size={16} />}
                />
            </Paper>

            {/* Results */}
            {jobs.data.length > 0 ? (
                <Grid>
                    {jobs.data.map((job) => (
                        <Grid.Col
                            key={job.id}
                            span={{
                                base: 12,
                                md: 6,
                            }}
                        >
                            <Card
                                component={Link}
                                href={`/jobs/browse/${job.slug}`}
                                withBorder
                                radius="lg"
                                padding="lg"
                                h="100%"
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                <Stack gap="lg" h="100%">
                                    {/* Job header */}
                                    <Group
                                        justify="space-between"
                                        align="flex-start"
                                        wrap="nowrap"
                                    >
                                        <Group gap="sm" wrap="nowrap">
                                            <Paper
                                                w={48}
                                                h={48}
                                                radius="md"
                                                withBorder
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <BriefcaseBusiness size={22} />
                                            </Paper>

                                            <Stack gap={3}>
                                                <Text fw={600} lineClamp={2}>
                                                    {job.title}
                                                </Text>

                                                <Group gap={5}>
                                                    <Building2 size={14} />

                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        lineClamp={1}
                                                    >
                                                        {job.company.name}
                                                    </Text>
                                                </Group>
                                            </Stack>
                                        </Group>

                                     
                                    </Group>

                                    {/* Job metadata */}
                                    <Group gap="md" c="dimmed">
                                        {job.location && (
                                            <Group gap={5}>
                                                <MapPin size={15} />

                                                <Text size="xs">
                                                    {job.location}
                                                </Text>
                                            </Group>
                                        )}

                                        <Text size="xs" tt="capitalize">
                                            {job.employment_type}
                                        </Text>

                                        <Text size="xs" tt="capitalize">
                                            {job.experience_level}
                                        </Text>
                                    </Group>

                                    {/* Description */}
                                    <Text size="sm" c="dimmed" lineClamp={3}>
                                        {job.description}
                                    </Text>

                                    {/* Footer */}
                                    <Group
                                        justify="space-between"
                                        mt="auto"
                                        align="flex-end"
                                    >
                                        <Stack gap={3}>
                                            <Text size="sm" fw={600}>
                                                {formatSalary(job)}
                                            </Text>

                                            {job.closing_date ? (
                                                <Group gap={5}>
                                                    <CalendarDays size={14} />

                                                    <Text size="xs" c="dimmed">
                                                        Closes{' '}
                                                        {formatDate(
                                                            job.closing_date,
                                                        )}
                                                    </Text>
                                                </Group>
                                            ) : (
                                                <Text size="xs" c="dimmed">
                                                    No deadline
                                                </Text>
                                            )}
                                        </Stack>

                                        <Text size="sm" c="blue" fw={500}>
                                            View job →
                                        </Text>
                                    </Group>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            ) : (
                <Paper withBorder radius="lg" p="xl">
                    <Stack align="center" gap="xs">
                        <BriefcaseBusiness size={32} />

                        <Text fw={600}>No jobs found</Text>

                        <Text size="sm" c="dimmed">
                            {filters.search
                                ? 'Try searching for another job.'
                                : 'There are no open positions available.'}
                        </Text>
                    </Stack>
                </Paper>
            )}

            {/* Pagination */}
            {jobs.last_page > 1 && (
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        Showing {jobs.from ?? 0}–{jobs.to ?? 0} of {jobs.total}
                    </Text>

                    <Pagination
                        value={jobs.current_page}
                        total={jobs.last_page}
                        onChange={(page) => {
                            router.get(
                                '/jobs/browse',
                                {
                                    search: filters.search || undefined,
                                    page,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                },
                            );
                        }}
                    />
                </Group>
            )}
        </Stack>
    );
}
