import { Head, Link, router } from '@inertiajs/react';
import {
    Card,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import {
    Bell,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    XCircle,
} from 'lucide-react';

import { ApplicationStatus } from '@/pages/applications/components/ui/ApplicationStatus';
import AppButton from '@/shared/components/ui/AppButton';
import { formatDate } from '@/shared/constant/helper';
import type { DashboardProps } from '../types/dashboard';

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    reviewing: 'Reviewing',
    shortlisted: 'Shortlisted',
    rejected: 'Rejected',
    hired: 'Hired',
    withdrawn: 'Withdrawn',
};

function getStatusIcon(status: string) {
    switch (status) {
        case 'shortlisted':
        case 'hired':
            return <CheckCircle2 size={20} />;

        case 'rejected':
        case 'withdrawn':
            return <XCircle size={20} />;

        case 'reviewing':
            return <Clock3 size={20} />;

        default:
            return <BriefcaseBusiness size={20} />;
    }
}

export default function Index({
    applicationStats,
    applications,
    notifications,
}: DashboardProps) {
    const markNotificationAsRead = (id: string) => {
        router.patch(
            `/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const stats = [
        {
            label: 'Applications',
            value: applicationStats.total,
            icon: <BriefcaseBusiness size={20} />,
        },
        {
            label: 'Pending',
            value: applicationStats.pending,
            icon: <Clock3 size={20} />,
        },
        {
            label: 'Reviewing',
            value: applicationStats.reviewing,
            icon: <FileText size={20} />,
        },
        {
            label: 'Shortlisted',
            value: applicationStats.shortlisted,
            icon: <CheckCircle2 size={20} />,
        },
    ];

    return (
        <>
            <Head title="Job seeker Dashboard" />
            <Stack gap="xl">
                {/* Header */}
                <Stack gap={4}>
                    <Title order={2}>Dashboard</Title>

                    <Text c="dimmed">
                        Track your applications and stay updated on your job
                        search.
                    </Text>
                </Stack>

                {/* Application statistics */}
                <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
                    {stats.map((stat) => (
                        <Card
                            key={stat.label}
                            withBorder
                            radius="lg"
                            padding="lg"
                        >
                            <Group justify="space-between">
                                <Stack gap={4}>
                                    <Text size="sm" c="dimmed">
                                        {stat.label}
                                    </Text>

                                    <Text size="xl" fw={700}>
                                        {stat.value}
                                    </Text>
                                </Stack>

                                <ThemeIcon
                                    variant="light"
                                    size="lg"
                                    radius="md"
                                >
                                    {stat.icon}
                                </ThemeIcon>
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid>

                {/* Quick actions */}
                <Group>
                    <Link href="/jobs/browse">
                        <AppButton>Browse Jobs</AppButton>
                    </Link>
                    <Link href="/applications">
                        <AppButton variant="light">My Applications</AppButton>
                    </Link>

                    <Link href="/resumes">
                        <AppButton variant="light">My Resumes</AppButton>
                    </Link>
                </Group>

                {/* Recent applications */}
                <Card withBorder radius="lg" padding="xl">
                    <Stack gap="lg">
                        <Group justify="space-between">
                            <Group gap="sm">
                                <BriefcaseBusiness size={20} />

                                <Title order={3}>Recent Applications</Title>
                            </Group>

                            {applications.length > 0 && (
                                <Text
                                    component={Link}
                                    href="/applications"
                                    size="sm"
                                    fw={600}
                                    style={{ textDecoration: 'none' }}
                                >
                                    View all
                                </Text>
                            )}
                        </Group>

                        {applications.length === 0 ? (
                            <Paper withBorder radius="md" p="xl">
                                <Stack align="center" gap="sm">
                                    <BriefcaseBusiness size={32} />

                                    <Text fw={600}>No applications yet</Text>

                                    <Text size="sm" c="dimmed" ta="center">
                                        Start applying for jobs to see them
                                        here.
                                    </Text>
                                </Stack>
                            </Paper>
                        ) : (
                            <Stack gap="sm">
                                {applications.map((application) => (
                                    <Paper
                                        key={application.id}
                                        component={Link}
                                        href={`/applications/${application.id}`}
                                        withBorder
                                        radius="md"
                                        p="md"
                                        style={{
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <Group
                                            justify="space-between"
                                            align="flex-start"
                                            wrap="nowrap"
                                        >
                                            <Group
                                                align="flex-start"
                                                wrap="nowrap"
                                            >
                                                <ThemeIcon
                                                    variant="light"
                                                    size="lg"
                                                    radius="md"
                                                >
                                                    {getStatusIcon(
                                                        application.status,
                                                    )}
                                                </ThemeIcon>

                                                <Stack gap={3}>
                                                    <Text fw={600}>
                                                        {application.job.title}
                                                    </Text>

                                                    <Text size="sm" c="dimmed">
                                                        {
                                                            application.job
                                                                .company.name
                                                        }
                                                    </Text>

                                                    <Text size="xs" c="dimmed">
                                                        Applied{' '}
                                                        {formatDate(
                                                            application.applied_at,
                                                        )}
                                                    </Text>
                                                </Stack>
                                            </Group>

                                            <ApplicationStatus
                                                status={application.status}
                                            />
                                        </Group>
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </Card>

                {/* Notifications */}
                <Card withBorder radius="lg" padding="xl">
                    <Stack gap="lg">
                        <Group justify="space-between">
                            <Group gap="sm">
                                <Bell size={20} />

                                <Title order={3}>Recent Notifications</Title>
                            </Group>

                            {notifications.length > 0 && (
                                <Text
                                    component={Link}
                                    href="/notifications"
                                    size="sm"
                                    fw={600}
                                    style={{ textDecoration: 'none' }}
                                >
                                    View all
                                </Text>
                            )}
                        </Group>

                        {notifications.length === 0 ? (
                            <Paper withBorder radius="md" p="xl">
                                <Stack align="center" gap="sm">
                                    <Bell size={32} />

                                    <Text fw={600}>No new notifications</Text>

                                    <Text size="sm" c="dimmed" ta="center">
                                        You're all caught up.
                                    </Text>
                                </Stack>
                            </Paper>
                        ) : (
                            <Stack gap={0}>
                                {notifications.map((notification) => {
                                    const data = notification.data;

                                    return (
                                        <Paper
                                            key={notification.id}
                                            component={Link}
                                            href={`/applications/${data.application_id}`}
                                            p="md"
                                            radius={0}
                                            style={{
                                                textDecoration: 'none',
                                                borderBottom:
                                                    '1px solid var(--mantine-color-default-border)',
                                            }}
                                            onClick={() =>
                                                markNotificationAsRead(
                                                    notification.id,
                                                )
                                            }
                                        >
                                            <Group
                                                align="flex-start"
                                                wrap="nowrap"
                                            >
                                                <ThemeIcon
                                                    variant="light"
                                                    size="lg"
                                                >
                                                    {getStatusIcon(
                                                        data.new_status,
                                                    )}
                                                </ThemeIcon>

                                                <Stack gap={3}>
                                                    <Text size="sm" fw={600}>
                                                        Application update
                                                    </Text>

                                                    <Text size="sm">
                                                        Your application for{' '}
                                                        <strong>
                                                            {data.job_title}
                                                        </strong>{' '}
                                                        is now{' '}
                                                        <strong>
                                                            {statusLabels[
                                                                data.new_status
                                                            ] ??
                                                                data.new_status}
                                                        </strong>
                                                        .
                                                    </Text>

                                                    <Text size="xs" c="dimmed">
                                                        {data.company_name} ·{' '}
                                                        {formatDate(
                                                            notification.created_at,
                                                        )}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        )}
                    </Stack>
                </Card>
            </Stack>
        </>
    );
}
