import { Link, usePage } from '@inertiajs/react';
import {
    Badge,
   
    Card,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    MapPin,
} from 'lucide-react';

import AppBack from '@/shared/components/ui/AppBack';
import AppButton from '@/shared/components/ui/AppButton';
import { formatDate, formatSalary } from '@/shared/constant/helper';

import type { Job } from '../types/job';

type PublicShowProps = {
    job: Job;
    hasApplied: boolean;
};

export default function BrowseShow({ job, hasApplied }: PublicShowProps) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isJobSeeker = user?.role?.name === 'job seeker';

    return (
        <Stack gap="xl">
            {/* Back */}
            <AppBack href={'/jobs/browse'} to={'jobs'} />

            {/* Main layout */}
            <Group align="flex-start" gap="xl" wrap="wrap">
                <Stack
                    gap="xl"
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Paper withBorder radius="lg" p="xl">
                        <Stack gap="lg">
                            <Group align="flex-start" gap="md" wrap="nowrap">
                                <Paper
                                    withBorder
                                    w={64}
                                    h={64}
                                    radius="md"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <BriefcaseBusiness size={30} />
                                </Paper>

                                <Stack gap={5}>
                                    <Title order={2}>{job.title}</Title>

                                    <Group gap="xs">
                                        <Building2 size={16} />

                                        <Text size="sm" fw={500}>
                                            {job.company.name}
                                        </Text>
                                    </Group>
                                </Stack>
                            </Group>

                            <Divider />

                            {/* Metadata */}
                            <Group gap="md">
                                {job.location && (
                                    <Group gap={6}>
                                        <MapPin size={16} />

                                        <Text size="sm">{job.location}</Text>
                                    </Group>
                                )}

                                <Badge variant="light" tt="capitalize">
                                    {job.employment_type}
                                </Badge>

                                <Badge variant="light" tt="capitalize">
                                    {job.experience_level}
                                </Badge>
                            </Group>

                            <Stack gap={3}>
                                <Text size="xs" c="dimmed" fw={500}>
                                    Salary
                                </Text>

                                <Text size="lg" fw={700}>
                                    {formatSalary(job)}
                                </Text>
                            </Stack>
                        </Stack>
                    </Paper>

                    <Paper withBorder radius="lg" p="xl">
                        <Stack gap="md">
                            <Title order={3}>Job description</Title>

                            <Text
                                size="sm"
                                lh={1.8}
                                style={{
                                    whiteSpace: 'pre-line',
                                }}
                            >
                                {job.description}
                            </Text>
                        </Stack>
                    </Paper>
                </Stack>

                {/* Sidebar */}
                <Stack gap="md" w={{ base: '100%', md: 320 }}>
                    <Card withBorder radius="lg" padding="lg">
                        <Stack gap="md">
                            <Title order={4}>Interested in this job?</Title>

                            <Text size="sm" c="dimmed">
                                Submit your application to
                                {` ${job.company.name}`}.
                            </Text>
                            {!user ? (
                                <AppButton component={Link} href="/login">
                                    Login to Apply
                                </AppButton>
                            ) : isJobSeeker ? (
                                <AppButton
                                    component={hasApplied ? 'button' : Link}
                                    href={
                                        hasApplied
                                            ? undefined
                                            : `/jobs/browse/${job.slug}/apply`
                                    }
                                    disabled={hasApplied}
                                    variant={hasApplied ? 'light' : 'filled'}
                                >
                                    {hasApplied
                                        ? 'Already Applied'
                                        : 'Apply Now'}
                                </AppButton>
                            ) : null}
                            {job.closing_date && (
                                <Group gap="xs" c="dimmed">
                                    <CalendarDays size={15} />

                                    <Text size="xs">
                                        Applications close{' '}
                                        {formatDate(job.closing_date)}
                                    </Text>
                                </Group>
                            )}
                        </Stack>
                    </Card>

                    {/* Company */}
                    <Card withBorder radius="lg" padding="lg">
                        <Stack gap="md">
                            <Title order={4}>About the company</Title>

                            <Group gap="sm">
                                <Paper
                                    withBorder
                                    w={44}
                                    h={44}
                                    radius="md"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Building2 size={20} />
                                </Paper>

                                <Stack gap={2}>
                                    <Text fw={600}>{job.company.name}</Text>

                                    <Text size="xs" c="dimmed">
                                        {job.company.location}
                                    </Text>
                                </Stack>
                            </Group>

                            <Link
                                href={`/companies/browse/${job.company.slug}`}
                                style={{
                                    textDecoration: 'none',
                                }}
                            >
                                <Text size="sm" fw={500} c="blue">
                                    View company →
                                </Text>
                            </Link>
                        </Stack>
                    </Card>
                </Stack>
            </Group>
        </Stack>
    );
}
