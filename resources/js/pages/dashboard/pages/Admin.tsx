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
    ShieldCheck,
    Users,
} from 'lucide-react';

import type { Company } from '@/pages/companies/types/company';
import type { Job } from '@/pages/jobs/types/job';
import AppButton from '@/shared/components/ui/AppButton';
import { formatDate } from '@/shared/constant/helper';
import type { User } from '@/types';


type AdminStats = {
    users: number;
    activeUsers: number;
    companies: number;
    verifiedCompanies: number;
    jobs: number;
    publishedJobs: number;
    applications: number;
    pendingApplications: number;
};

type AdminDashboardProps = {
    stats: AdminStats;
    recentUsers: User[];
    recentCompanies: Company[];
    recentJobs: Job[];
};

export default function AdminDashboard({
    stats,
    recentUsers,
    recentCompanies,
    recentJobs,
}: AdminDashboardProps) {
    const dashboardStats = [
        {
            label: 'Users',
            value: stats.users,
            icon: <Users size={20} />,
        },
        {
            label: 'Active Users',
            value: stats.activeUsers,
            icon: <CheckCircle2 size={20} />,
        },
        {
            label: 'Companies',
            value: stats.companies,
            icon: <Building2 size={20} />,
        },
        {
            label: 'Verified Companies',
            value: stats.verifiedCompanies,
            icon: <ShieldCheck size={20} />,
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
            icon: <FileText size={20} />,
        },
        {
            label: 'Pending Applications',
            value: stats.pendingApplications,
            icon: <Clock3 size={20} />,
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <Stack gap={4}>
                        <Title order={2}>Admin Dashboard</Title>

                        <Text c="dimmed">
                            Monitor and manage the HireFlow platform.
                        </Text>
                    </Stack>

                    <Group>
                        <Link href="/users">
                            <AppButton leftSection={<Users size={16} />}>
                                Manage Users
                            </AppButton>
                        </Link>

                        <Link href="/companies">
                            <AppButton variant="light">
                                Manage Companies
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
                                <Building2 size={20} />

                                <Title order={3}>Company Verification</Title>
                            </Group>

                            <Group gap="xl">
                                <Stack gap={2}>
                                    <Text size="xl" fw={700}>
                                        {stats.verifiedCompanies}
                                    </Text>

                                    <Text size="sm" c="dimmed">
                                        Verified
                                    </Text>
                                </Stack>

                                <Stack gap={2}>
                                    <Text size="xl" fw={700}>
                                        {stats.companies -
                                            stats.verifiedCompanies}
                                    </Text>

                                    <Text size="sm" c="dimmed">
                                        Awaiting verification
                                    </Text>
                                </Stack>
                            </Group>

                            <Link href="/companies">
                                <AppButton variant="light">
                                    Review Companies
                                </AppButton>
                            </Link>
                        </Stack>
                    </Card>

                    <Card withBorder radius="lg" padding="xl">
                        <Stack gap="lg">
                            <Group gap="sm">
                                <Users size={20} />

                                <Title order={3}>User Accounts</Title>
                            </Group>

                            <Group gap="xl">
                                <Stack gap={2}>
                                    <Text size="xl" fw={700}>
                                        {stats.activeUsers}
                                    </Text>

                                    <Text size="sm" c="dimmed">
                                        Active
                                    </Text>
                                </Stack>

                                <Stack gap={2}>
                                    <Text size="xl" fw={700}>
                                        {stats.users - stats.activeUsers}
                                    </Text>

                                    <Text size="sm" c="dimmed">
                                        Inactive / suspended
                                    </Text>
                                </Stack>
                            </Group>

                            <Link href="/users">
                                <AppButton variant="light">
                                    Manage Users
                                </AppButton>
                            </Link>
                        </Stack>
                    </Card>
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, md: 2 }}>
                    <Card withBorder radius="lg" padding="xl">
                        <Stack gap="lg">
                            <Group justify="space-between">
                                <Group gap="sm">
                                    <Users size={20} />

                                    <Title order={3}>Recent Users</Title>
                                </Group>

                                <Text
                                    component={Link}
                                    href="/users"
                                    size="sm"
                                    fw={600}
                                    style={{
                                        textDecoration: 'none',
                                    }}
                                >
                                    View all
                                </Text>
                            </Group>

                            {recentUsers.length === 0 ? (
                                <Text c="dimmed">No users found.</Text>
                            ) : (
                                <Stack gap="sm">
                                    {recentUsers.map((user) => (
                                        <Paper
                                            key={user.id}
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
                                                        {user.name}
                                                    </Text>

                                                    <Text size="sm" c="dimmed">
                                                        {user.email}
                                                    </Text>
                                                </Stack>

                                                <Badge
                                                    variant="light"
                                                    tt="capitalize"
                                                >
                                                    {user.role.name}
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
                            <Group justify="space-between">
                                <Group gap="sm">
                                    <Building2 size={20} />

                                    <Title order={3}>Recent Companies</Title>
                                </Group>

                                <Text
                                    component={Link}
                                    href="/companies"
                                    size="sm"
                                    fw={600}
                                    style={{
                                        textDecoration: 'none',
                                    }}
                                >
                                    View all
                                </Text>
                            </Group>

                            {recentCompanies.length === 0 ? (
                                <Text c="dimmed">No companies found.</Text>
                            ) : (
                                <Stack gap="sm">
                                    {recentCompanies.map((company) => (
                                        <Paper
                                            key={company.id}
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
                                                        {company.name}
                                                    </Text>

                                                    <Text size="sm" c="dimmed">
                                                        Owner:{' '}
                                                        {company?.user?.name}
                                                    </Text>
                                                </Stack>

                                                <Badge
                                                    color={
                                                        company.is_verified
                                                            ? 'green'
                                                            : 'orange'
                                                    }
                                                    variant="light"
                                                >
                                                    {company.is_verified
                                                        ? 'Verified'
                                                        : 'Pending'}
                                                </Badge>
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
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
                                style={{
                                    textDecoration: 'none',
                                }}
                            >
                                View all
                            </Text>
                        </Group>

                        {recentJobs.length === 0 ? (
                            <Text c="dimmed">No jobs found.</Text>
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
            </Stack>
        </>
    );
}
