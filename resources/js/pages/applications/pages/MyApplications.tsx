import { Link } from '@inertiajs/react';
import { Card, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Building2, CalendarDays, Eye, FileText, MapPin } from 'lucide-react';

import AppPagination from '@/shared/components/ui/app-pagination';
import AppButton from '@/shared/components/ui/AppButton';
import { formatDate } from '@/shared/constant/helper';
import type { PaginatedResponse } from '@/shared/types/pagination';

import { ApplicationStatus } from '../components/ui/ApplicationStatus';
import type { Application } from '../types/application';

type Props = {
    applications: PaginatedResponse<Application>;
};

export default function MyApplications({ applications }: Props) {
    return (
        <Stack gap="xl">
            {/* Header */}
            <Stack gap={4}>
                <Title order={2}>My Applications</Title>

                <Text c="dimmed">
                    Track the jobs you have applied for and their current
                    status.
                </Text>
            </Stack>

            {/* Empty state */}
            {applications.data.length === 0 ? (
                <Paper withBorder radius="lg" p="xl">
                    <Stack align="center" gap="sm">
                        <FileText size={36} />

                        <Text fw={600}>No applications yet</Text>

                        <Text size="sm" c="dimmed" ta="center">
                            You have not applied for any jobs yet.
                        </Text>

                        <Link href="/jobs/browse">
                            <AppButton mt="sm">Browse Jobs</AppButton>
                        </Link>
                    </Stack>
                </Paper>
            ) : (
                <>
                    {/* Applications */}
                    <Stack gap="md">
                        {applications.data.map((application) => (
                            <Card
                                key={application.id}
                                withBorder
                                radius="lg"
                                padding="lg"
                            >
                                {/* Job header */}
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                >
                                    <Stack gap="xs">
                                        <Group gap="sm">
                                            <Title order={4}>
                                                {application.job.title}
                                            </Title>

                                            <ApplicationStatus
                                                status={application.status}
                                            />
                                        </Group>

                                        <Group gap="md" c="dimmed">
                                            <Group gap={5}>
                                                <Building2 size={15} />

                                                <Text size="sm">
                                                    {
                                                        application.job.company
                                                            .name
                                                    }
                                                </Text>
                                            </Group>

                                            {application.job.location && (
                                                <Group gap={5}>
                                                    <MapPin size={15} />

                                                    <Text size="sm">
                                                        {
                                                            application.job
                                                                .location
                                                        }
                                                    </Text>
                                                </Group>
                                            )}
                                        </Group>
                                    </Stack>

                                    <Link
                                        href={`/jobs/browse/${application.job.slug}`}
                                    >
                                        <AppButton
                                            variant="subtle"
                                            size="compact-sm"
                                            leftSection={<Eye size={15} />}
                                        >
                                            View Job
                                        </AppButton>
                                    </Link>
                                </Group>

                                <Divider my="md" />

                                {/* Application metadata */}
                                <Group gap="xl">
                                    <Group gap="xs">
                                        <CalendarDays size={15} />

                                        <Stack gap={0}>
                                            <Text size="xs" c="dimmed">
                                                Applied
                                            </Text>

                                            <Text size="sm">
                                                {formatDate(
                                                    application.applied_at,
                                                )}
                                            </Text>
                                        </Stack>
                                    </Group>

                                    {application.resume && (
                                        <Group gap="xs">
                                            <FileText size={15} />

                                            <Stack gap={0}>
                                                <Text size="xs" c="dimmed">
                                                    Resume
                                                </Text>

                                                <Text size="sm">
                                                    {application.resume.title}
                                                </Text>
                                            </Stack>
                                        </Group>
                                    )}
                                </Group>

                                {/* Cover letter */}
                                {application.cover_letter && (
                                    <Stack gap={4} mt="lg">
                                        <Text size="sm" fw={600}>
                                            Cover Letter
                                        </Text>

                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            lh={1.6}
                                            lineClamp={3}
                                        >
                                            {application.cover_letter}
                                        </Text>
                                    </Stack>
                                )}
                            </Card>
                        ))}
                    </Stack>

                    <AppPagination data={applications} />
                </>
            )}
        </Stack>
    );
}
