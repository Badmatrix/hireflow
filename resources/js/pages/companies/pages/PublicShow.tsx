import { Link } from '@inertiajs/react';
import {
    Anchor,
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
    Globe,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react';

import AppBack from '@/shared/components/ui/AppBack';
import { formatDate, formatSalary } from '@/shared/constant/helper';
import type { Company } from '../types/company';

type PublicShowProps = {
    company: Company;
};

export default function PublicShow({ company }: PublicShowProps) {
    const jobs = company.jobs ?? [];
   

    return (
        <Stack gap="xl">
            <AppBack href={'/companies/browse'} to={'companies'} />

            {/* Company Header */}
            <Paper withBorder p="xl" radius="lg">
                <Stack gap="lg">
                    <Group justify="space-between" align="flex-start">
                        <Group gap="md" align="flex-start">
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
                                <Building2 size={30} />
                            </Paper>

                            <Stack gap={4}>
                                <Group gap="sm">
                                    <Title order={2}>{company.name}</Title>

                                    <Badge
                                        color={
                                            company.is_verified
                                                ? 'green'
                                                : 'yellow'
                                        }
                                        variant="light"
                                    >
                                        {company.is_verified
                                            ? 'Verified'
                                            : 'Pending'}
                                    </Badge>
                                </Group>

                                <Text size="sm" c="dimmed" tt="capitalize">
                                    {company.company_type}
                                </Text>
                            </Stack>
                        </Group>
                    </Group>

                    {company.slogan && <Text size="md">{company.slogan}</Text>}

                    <Divider />

                    <Group gap="xl">
                        {company.location && (
                            <Group gap="xs">
                                <MapPin size={17} />

                                <Text size="sm">{company.location}</Text>
                            </Group>
                        )}

                        {company.email && (
                            <Group gap="xs">
                                <Mail size={17} />

                                <Anchor
                                    href={`mailto:${company.email}`}
                                    size="sm"
                                >
                                    {company.email}
                                </Anchor>
                            </Group>
                        )}

                        {company.phone && (
                            <Group gap="xs">
                                <Phone size={17} />

                                <Anchor href={`tel:${company.phone}`} size="sm">
                                    {company.phone}
                                </Anchor>
                            </Group>
                        )}

                        {company.website && (
                            <Group gap="xs">
                                <Globe size={17} />

                                <Anchor
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="sm"
                                >
                                    Visit website
                                </Anchor>
                            </Group>
                        )}
                    </Group>
                </Stack>
            </Paper>

            {company.description && (
                <Paper withBorder p="xl" radius="lg">
                    <Stack gap="sm">
                        <Title order={3}>About {company.name}</Title>

                        <Text size="sm" c="dimmed" lh={1.7}>
                            {company.description}
                        </Text>
                    </Stack>
                </Paper>
            )}

            {/* Jobs */}
            <Stack gap="md">
                <Group justify="space-between">
                    <div>
                        <Title order={3}>Open positions</Title>

                        <Text size="sm" c="dimmed">
                            Current opportunities at {company.name}.
                        </Text>
                    </div>

                    <Badge
                        variant="light"
                        leftSection={<BriefcaseBusiness size={14} />}
                    >
                        {jobs.length} open{' '}
                        {jobs.length === 1 ? 'position' : 'positions'}
                    </Badge>
                </Group>

                {jobs.length > 0 ? (
                    <Stack gap="sm">
                        {jobs.map((job) => (
                            <Card
                                key={job.id}
                                component={Link}
                                href={`/jobs/browse/${job.slug}`}
                                withBorder
                                radius="lg"
                                padding="lg"
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                >
                                    <Stack gap={6}>
                                        <Text fw={600}>{job.title}</Text>

                                        <Group gap="md" c="dimmed">
                                            {job.location && (
                                                <Group gap={4}>
                                                    <MapPin size={14} />

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
                                    </Stack>

                                    <Stack gap={4} align="flex-end">
                                        <Text size="sm" fw={600}>
                                            {formatSalary(job)}
                                        </Text>

                                        <Text size="xs" c="dimmed">
                                            {job.closing_date
                                                ? `Closes ${formatDate(job.closing_date)}`
                                                : 'No deadline'}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <Paper withBorder radius="lg" p="xl">
                        <Stack align="center" gap="xs">
                            <BriefcaseBusiness size={30} />

                            <Text fw={600}>No open positions</Text>

                            <Text size="sm" c="dimmed">
                                This company isn't currently hiring.
                            </Text>
                        </Stack>
                    </Paper>
                )}
            </Stack>
        </Stack>
    );
}
