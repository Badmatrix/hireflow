import { Link } from '@inertiajs/react';
import { Badge, Group, Card, Stack, Text } from '@mantine/core';
import { ArrowRight, MapPin } from 'lucide-react';
import AppButton from '@/shared/components/ui/AppButton';
import { formatSalary } from '@/shared/constant/helper';
import type { Job } from '../../types/job';

export default function JobCard({ job }: { job: Job }) {
    return (
        <Card withBorder radius="lg" padding="lg">
            <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                        <Text fw={600} size="lg">
                            {job.title}
                        </Text>

                        <Text size="sm" c="dimmed">
                            {job.company.name}
                        </Text>
                    </Stack>

                    <Badge variant="light">New</Badge>
                </Group>

                <Text size="sm" c="dimmed" lineClamp={3}>
                    {job.description}
                </Text>

                <Stack gap={6}>
                    <Text size="sm" fw={500}>
                        {formatSalary(job)}
                    </Text>

                    {job.company.location && (
                        <Group gap={6}>
                            <MapPin size={15} />

                            <Text size="sm" c="dimmed">
                                {job.company.location}
                            </Text>
                        </Group>
                    )}
                </Stack>

                <Link href={`/jobs/browse/${job.id}`}>
                    <AppButton
                        variant="light"
                        rightSection={<ArrowRight size={16} />}
                    >
                        View Job
                    </AppButton>
                </Link>
            </Stack>
        </Card>
    );
}
