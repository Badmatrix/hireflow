import { Link, router, usePage } from '@inertiajs/react';
import {
    Button,
    Card,
    Divider,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { ArrowLeft, CalendarDays, Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import ConfirmationModal from '@/shared/components/feedback/AppModal';
import { formatDate, formatSalary } from '@/shared/constant/helper';
import type { User } from '@/types';
import { JobStatus } from '../components/ui/JobStatus';
import type { Job } from '../types/job';
import AppButton from '@/shared/components/ui/AppButton';

type PendingAction = {
    type: 'delete' | 'publish';
    job: Job;
} | null;

type ShowJobProps = {
    job: Job;
};

type PageProps = {
    auth: {
        user: User;
    };
};

export default function Show({ job }: ShowJobProps) {
    const { auth } = usePage<PageProps>().props;

    const [pendingAction, setPendingAction] =
        useState<PendingAction>(null);

    const [processing, setProcessing] = useState(false);

    const isAdmin = auth.user.role?.name === 'admin';
    const isEmployer = auth.user.role?.name === 'employer';

    const openModal = (type: 'delete' | 'publish') => {
        setPendingAction({
            type,
            job,
        });
    };

    const closeModal = () => {
        if (processing) {
            return;
        }

        setPendingAction(null);
    };

    const handleConfirm = () => {
        if (!pendingAction) {
            return;
        }

        setProcessing(true);

        if (pendingAction.type === 'delete') {
            router.delete(`/jobs/${job.id}`, {
                onFinish: () => {
                    setProcessing(false);
                },
            });

            return;
        }

        router.post(
            `/jobs/${job.id}/publish`,
            {},
            {
                onFinish: () => {
                    setProcessing(false);
                    setPendingAction(null);
                },
            },
        );
    };

    return (
        <>
            <Stack gap="xl">
                {/* Back */}
                <AppButton
                    component={Link}
                    href="/jobs"
                    variant="subtle"
                    leftSection={<ArrowLeft size={16} />}
                    w="fit-content"
                >
                    Back to Jobs
                </AppButton>

                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                        <Group gap="sm">
                            <Title order={2}>{job.title}</Title>

                            <JobStatus status={job.status} />
                        </Group>

                        <Text c="dimmed">{job.company.name}</Text>
                    </Stack>

                    <Group>
                        {/* Applications */}
                        {(isEmployer || isAdmin) && (
                            <AppButton
                                component={Link}
                                href={`/jobs/${job.id}/applications`}
                                variant="light"
                                leftSection={<Eye size={16} />}
                            >
                                Applications
                            </AppButton>
                        )}

                        {/* Publish */}
                        {isEmployer && job.status === 'draft' && (
                            <AppButton
                                color="green"
                                variant="light"
                                onClick={() => openModal('publish')}
                            >
                                Publish
                            </AppButton>
                        )}

                        {/* Edit */}
                        {isEmployer && (
                            <AppButton
                                component={Link}
                                href={`/jobs/${job.id}/edit`}
                                leftSection={<Pencil size={16} />}
                            >
                                Edit
                            </AppButton>
                        )}

                        {/* Delete */}
                        {(isEmployer || isAdmin) && (
                            <AppButton
                                color="red"
                                variant="light"
                                leftSection={<Trash2 size={16} />}
                                onClick={() => openModal('delete')}
                            >
                                Delete
                            </AppButton>
                        )}
                    </Group>
                </Group>

                {/* Job Details */}
                <Card withBorder radius="lg" padding="xl">
                    <Stack gap="lg">
                        <Title order={3}>Job Details</Title>

                        <Group gap="xl">
                            <Stack gap={2}>
                                <Text size="sm" c="dimmed">
                                    Salary
                                </Text>

                                <Text fw={500}>
                                    {formatSalary(job)}
                                </Text>
                            </Stack>

                            <Stack gap={2}>
                                <Text size="sm" c="dimmed">
                                    Closing Date
                                </Text>

                                <Group gap={6}>
                                    <CalendarDays size={16} />

                                    <Text fw={500}>
                                        {job.closing_date
                                            ? formatDate(
                                                  job.closing_date,
                                              )
                                            : 'No deadline'}
                                    </Text>
                                </Group>
                            </Stack>

                            <Stack gap={2}>
                                <Text size="sm" c="dimmed">
                                    Company
                                </Text>

                                <Text fw={500}>
                                    {job.company.name}
                                </Text>
                            </Stack>
                        </Group>

                        <Divider />

                        <Stack gap="sm">
                            <Title order={4}>Description</Title>

                            <Text
                                style={{
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {job.description}
                            </Text>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>

            {/* Confirmation Modal */}
            <ConfirmationModal
                opened={pendingAction !== null}
                onClose={closeModal}
                onConfirm={handleConfirm}
                loading={processing}
                title={
                    pendingAction?.type === 'delete'
                        ? 'Delete job'
                        : 'Publish job'
                }
                confirmLabel={
                    pendingAction?.type === 'delete'
                        ? 'Delete'
                        : 'Publish Job'
                }
                confirmColor={
                    pendingAction?.type === 'delete'
                        ? 'red'
                        : 'hireflowBlue.9'
                }
                description={
                    pendingAction?.type === 'delete' ? (
                        <>
                            Are you sure you want to delete{' '}
                            <Text component="span" fw={700}>
                                {pendingAction.job.title}
                            </Text>
                            ? This action cannot be undone.
                        </>
                    ) : (
                        <>
                            Publish{' '}
                            <Text component="span" fw={700}>
                                {pendingAction?.job.title}
                            </Text>
                            ? This will make the job visible to job
                            seekers.
                        </>
                    )
                }
            />
        </>
    );
}
