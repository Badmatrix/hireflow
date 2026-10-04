import { Head, Link } from '@inertiajs/react';
import {
    Badge,
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
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    Clock3,
    FileText,
    Plus,
    Users,
} from 'lucide-react';

import { ApplicationStatus } from '@/pages/applications/components/ui/ApplicationStatus';
import type { Application } from '@/pages/applications/types/application';
import type { Job } from '@/pages/jobs/types/job';
import AppButton from '@/shared/components/ui/AppButton';
import { formatDate } from '@/shared/constant/helper';

type EmployerStats = {
    companies: number;
    jobs: number;
    publishedJobs: number;
    applications: number;
    pendingApplications: number;
    shortlistedApplications: number;
};

type EmployerDashboardProps = {
    stats: EmployerStats;
    recentJobs: Job[];
    recentApplications: Application[];
};

export default function EmployerDashboard({
    stats,
    recentJobs,
    recentApplications,
}: EmployerDashboardProps) {
    const dashboardStats = [
        {
            label: 'Companies',
            value: stats.companies,
            icon: <Building2 size={20} />,
        },
        {
            label: 'Jobs',
            value: stats.jobs,
            icon: <BriefcaseBusiness size={20} />,
        },
        {
            label: 'Published Jobs',
            value: stats.publishedJobs,
            icon: <CheckCircle2 size={20} />,
        },
        {
            label: 'Applications',
            value: stats.applications,
            icon: <Users size={20} />,
        },
    ];

    return (
        <>
            <Head title="Employer Dashboard" />

            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <Stack gap={4}>
                        <Title order={2}>Employer Dashboard</Title>

                        <Text c="dimmed">
                            Manage your companies, jobs, and applications.
                        </Text>
                    </Stack>

                    <Group>
                        <Link href="/companies/create">
                            <AppButton leftSection={<Building2 size={16} />}>
                                Add Company
                            </AppButton>
                        </Link>

                        <Link href="/jobs/create">
                            <AppButton
                                variant="light"
                                leftSection={<Plus size={16} />}
                            >
                                Post Job
                            </AppButton>
                        </Link>
                    </Group>
                </Group>

                <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
                    {dashboardStats.map((stat) => (
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

                <SimpleGrid cols={{ base: 1, md: 2 }}>
                    <Card withBorder radius="lg" padding="xl">
                        <Stack gap="lg">
                            <Group gap="sm">
                                <Clock3 size={20} />

                                <Title order={3}>Pending Applications</Title>
                            </Group>

                            <Text size="2rem" fw={700}>
                                {stats.pendingApplications}
                            </Text>

                            <Text size="sm" c="dimmed">
                                Applications waiting for review.
                            </Text>

                            <Link href="/employer/applications">
                                <AppButton variant="light">
                                    View Applications
                                </AppButton>
                            </Link>
                        </Stack>
                    </Card>

                    <Card withBorder radius="lg" padding="xl">
                        <Stack gap="lg">
                            <Group gap="sm">
                                <CheckCircle2 size={20} />

                                <Title order={3}>Shortlisted Candidates</Title>
                            </Group>

                            <Text size="2rem" fw={700}>
                                {stats.shortlistedApplications}
                            </Text>

                            <Text size="sm" c="dimmed">
                                Candidates currently shortlisted.
                            </Text>

                            <Link href="/employer/applications">
                                <AppButton variant="light">
                                    Review Applications
                                </AppButton>
                            </Link>
                        </Stack>
                    </Card>
                </SimpleGrid>

                <Card withBorder radius="lg" padding="xl">
                    <Stack gap="lg">
                        <Group justify="space-between">
                            <Group gap="sm">
                                <BriefcaseBusiness size={20} />

                                <Title order={3}>Recent Jobs</Title>
                            </Group>

                            <Text
                                component={Link}
                                href="/jobs"
                                size="sm"
                                fw={600}
                                style={{ textDecoration: 'none' }}
                            >
                                View all
                            </Text>
                        </Group>

                        {recentJobs.length === 0 ? (
                            <Paper withBorder radius="md" p="xl">
                                <Stack align="center" gap="sm">
                                    <BriefcaseBusiness size={32} />

                                    <Text fw={600}>No jobs yet</Text>

                                    <Text size="sm" c="dimmed" ta="center">
                                        Create a job to start receiving
                                        applications.
                                    </Text>
                                </Stack>
                            </Paper>
                        ) : (
                            <Stack gap="sm">
                                {recentJobs.map((job) => (
                                    <Paper
                                        key={job.id}
                                        withBorder
                                        radius="md"
                                        p="md"
                                    >
                                        <Group
                                            justify="space-between"
                                            wrap="nowrap"
                                        >
                                            <Stack gap={3}>
                                                <Text fw={600}>
                                                    {job.title}
                                                </Text>

                                                <Text size="sm" c="dimmed">
                                                    {job.company.name}
                                                </Text>

                                                <Text size="xs" c="dimmed">
                                                    Created{' '}
                                                    {formatDate(job.created_at)}
                                                </Text>
                                            </Stack>

                                            <Badge
                                                variant="light"
                                                tt="capitalize"
                                            >
                                                {job.status}
                                            </Badge>
                                        </Group>
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </Card>

                <Card withBorder radius="lg" padding="xl">
                    <Stack gap="lg">
                        <Group gap="sm">
                            <FileText size={20} />

                            <Title order={3}>Recent Applications</Title>
                        </Group>

                        {recentApplications.length === 0 ? (
                            <Paper withBorder radius="md" p="xl">
                                <Stack align="center" gap="sm">
                                    <FileText size={32} />

                                    <Text fw={600}>No applications yet</Text>

                                    <Text size="sm" c="dimmed" ta="center">
                                        Applications for your jobs will appear
                                        here.
                                    </Text>
                                </Stack>
                            </Paper>
                        ) : (
                            <Stack gap="sm">
                                {recentApplications.map((application) => (
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
                                            wrap="nowrap"
                                        >
                                            <Stack gap={3}>
                                                <Text fw={600}>
                                                    {application.user.name}
                                                </Text>

                                                <Text size="sm" c="dimmed">
                                                    {application.job.title}
                                                </Text>

                                                <Text size="xs" c="dimmed">
                                                    Applied{' '}
                                                    {formatDate(
                                                        application.applied_at,
                                                    )}
                                                </Text>
                                            </Stack>

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
            </Stack>
        </>
    );
}
