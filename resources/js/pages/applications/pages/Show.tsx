import { Link, router } from '@inertiajs/react';
import {
    Button,
    Card,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    ArrowLeft,
    Briefcase,
    CalendarDays,
    Clock,
    Download,
    Mail,
    MapPin,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';

import ConfirmationModal from '@/shared/components/feedback/AppModal';
import AppButton from '@/shared/components/ui/AppButton';
import AppViewResume from '@/shared/components/ui/AppViewResume';
import { formatDate } from '@/shared/constant/helper';

import { ApplicationStatus } from '../components/ui/ApplicationStatus';
import type {
    Application,
    ApplicationStatus as ApplicationStatusType,
} from '../types/application';

type Props = {
    application: Application;
    canUpdateStatus: boolean;
    isJobSeeker: boolean;
};

type PendingStatus = ApplicationStatusType | null;

const statusLabels: Record<ApplicationStatusType, string> = {
    pending: 'Pending',
    reviewing: 'Reviewing',
    shortlisted: 'Shortlisted',
    rejected: 'Rejected',
    hired: 'Hired',
    withdrawn: 'Withdrawn',
};

export default function Show({
    application,
    isJobSeeker,
    canUpdateStatus,
}: Props) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedStatus, setSelectedStatus] = useState<PendingStatus>(null);
    const [processing, setProcessing] = useState(false);

    const [withdrawModalOpened, withdrawModal] = useDisclosure(false);
    const [withdrawing, setWithdrawing] = useState(false);

    const confirmStatusChange = (status: ApplicationStatusType) => {
        if (processing) {
            return;
        }

        setSelectedStatus(status);
        open();
    };

    const closeStatusModal = () => {
        if (processing) {
            return;
        }

        close();
        setSelectedStatus(null);
    };

    const updateStatus = () => {
        if (!selectedStatus || processing) {
            return;
        }

        setProcessing(true);

        router.patch(
            `/applications/${application.id}/status`,
            {
                status: selectedStatus,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    close();
                    setSelectedStatus(null);
                },

                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    const withdrawApplication = () => {
        if (withdrawing) {
            return;
        }

        setWithdrawing(true);

        router.patch(
            `/applications/${application.id}/withdraw`,
            {},
            {
                preserveScroll: true,

                onSuccess: () => {
                    withdrawModal.close();
                },

                onFinish: () => {
                    setWithdrawing(false);
                },
            },
        );
    };

    const closeWithdrawModal = () => {
        if (withdrawing) {
            return;
        }

        withdrawModal.close();
    };

    const getConfirmColor = () => {
        switch (selectedStatus) {
            case 'rejected':
                return 'red';

            case 'hired':
            case 'shortlisted':
                return 'green';

            default:
                return 'hireflowBlue.9';
        }
    };

    const canWithdraw =
        isJobSeeker && ['pending', 'reviewing'].includes(application.status);

    return (
        <>
            <Stack gap="xl">
                {/* Back */}
                <Button
                    component={Link}
                    href={
                        isJobSeeker
                            ? '/applications'
                            : `/jobs/${application.job.id}/applications`
                    }
                    variant="subtle"
                    leftSection={<ArrowLeft size={16} />}
                    w="fit-content"
                >
                    {isJobSeeker
                        ? 'Back to Applications'
                        : 'Back to Job Applications'}
                </Button>

                {/* Header */}
                <Stack gap={4}>
                    <Group gap="sm">
                        <Title order={2}>Application Details</Title>

                        <ApplicationStatus status={application.status} />
                    </Group>

                    <Text c="dimmed">
                        {application.job.title} · {application.job.company.name}
                    </Text>
                </Stack>

                {/* Applicant */}
                {!isJobSeeker && (
                    <Card withBorder radius="lg" padding="xl">
                        <Stack gap="lg">
                            <Title order={3}>Applicant</Title>

                            <Group align="flex-start">
                                <Paper withBorder p="md" radius="xl">
                                    <UserRound size={28} />
                                </Paper>

                                <Stack gap={4}>
                                    <Text fw={600} size="lg">
                                        {application.user.name}
                                    </Text>

                                    <Group gap="xs">
                                        <Mail size={16} />

                                        <Text size="sm" c="dimmed">
                                            {application.user.email}
                                        </Text>
                                    </Group>
                                </Stack>
                            </Group>
                        </Stack>
                    </Card>
                )}

                {/* Status History */}
                {!isJobSeeker &&
                    application.status_history &&
                    application.status_history.length > 0 && (
                        <Card withBorder radius="lg" padding="xl">
                            <Stack gap="lg">
                                <Group gap="sm">
                                    <Clock size={20} />

                                    <Title order={3}>Application History</Title>
                                </Group>

                                <Stack gap={0}>
                                    {application.status_history.map(
                                        (history, index) => (
                                            <Group
                                                key={history.id}
                                                align="flex-start"
                                                wrap="nowrap"
                                                gap="md"
                                            >
                                                <Stack
                                                    align="center"
                                                    gap={0}
                                                    style={{
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Paper
                                                        withBorder
                                                        radius="xl"
                                                        p={8}
                                                    >
                                                        <ApplicationStatus
                                                            status={
                                                                history.to_status
                                                            }
                                                        />
                                                    </Paper>

                                                    {index <
                                                        application
                                                            .status_history
                                                            .length -
                                                            1 && (
                                                        <Divider
                                                            orientation="vertical"
                                                            className="mx-auto h-14!"
                                                        />
                                                    )}
                                                </Stack>

                                                <Stack
                                                    gap={3}
                                                    pb={
                                                        index <
                                                        application
                                                            .status_history
                                                            .length -
                                                            1
                                                            ? 'md'
                                                            : 0
                                                    }
                                                >
                                                    <Group gap="xs">
                                                        <Text
                                                            fw={600}
                                                            size="sm"
                                                        >
                                                            {history.from_status
                                                                ? `${statusLabels[history.from_status]} → ${statusLabels[history.to_status]}`
                                                                : statusLabels[
                                                                      history
                                                                          .to_status
                                                                  ]}
                                                        </Text>
                                                    </Group>

                                                    <Text size="xs" c="dimmed">
                                                        {formatDate(
                                                            history.created_at,
                                                        )}
                                                    </Text>

                                                    {history.changed_by && (
                                                        <Text
                                                            size="xs"
                                                            c="dimmed"
                                                        >
                                                            Changed by{' '}
                                                            {
                                                                history
                                                                    .changed_by
                                                                    .name
                                                            }
                                                        </Text>
                                                    )}
                                                </Stack>
                                            </Group>
                                        ),
                                    )}
                                </Stack>
                            </Stack>
                        </Card>
                    )}

                {/* Job information */}
                <Card withBorder radius="lg" padding="xl">
                    <Stack gap="lg">
                        <Title order={3}>Job</Title>

                        <Group gap="sm" align="flex-start">
                            <Paper withBorder p="sm" radius="md">
                                <Briefcase size={22} />
                            </Paper>

                            <Stack gap={3}>
                                <Text fw={600}>{application.job.title}</Text>

                                <Text size="sm" c="dimmed">
                                    {application.job.company.name}
                                </Text>
                            </Stack>
                        </Group>

                        <Divider />

                        {application.job.location && (
                            <Group gap="xs">
                                <MapPin size={16} />

                                <Text size="sm" c="dimmed">
                                    {application.job.location}
                                </Text>
                            </Group>
                        )}

                        <Group gap="xs">
                            <CalendarDays size={16} />

                            <Text size="sm" c="dimmed">
                                Applied · {formatDate(application.applied_at)}
                            </Text>
                        </Group>
                    </Stack>
                </Card>

                {/* Resume */}
                <Card withBorder radius="lg" padding="xl">
                    <Stack gap="lg">
                        <Group justify="space-between">
                            <Group gap="sm">
                                <Download size={20} />

                                <Title order={3}>Resume</Title>
                            </Group>

                            {application.resume && (
                                <AppViewResume
                                    href={`/applications/${application.id}/resume`}
                                />
                            )}
                        </Group>

                        {application.resume ? (
                            <Paper withBorder p="md" radius="md">
                                <Stack gap={3}>
                                    <Text fw={500}>
                                        {application.resume.file_name}
                                    </Text>

                                    <Text size="sm" c="dimmed">
                                        {application.resume.title}
                                    </Text>
                                </Stack>
                            </Paper>
                        ) : (
                            <Text size="sm" c="dimmed">
                                No resume was attached to this application.
                            </Text>
                        )}
                    </Stack>
                </Card>

                {/* Cover letter */}
                <Card withBorder radius="lg" padding="xl">
                    <Stack gap="md">
                        <Title order={3}>Cover Letter</Title>

                        {application.cover_letter ? (
                            <Text
                                size="sm"
                                lh={1.7}
                                style={{
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {application.cover_letter}
                            </Text>
                        ) : (
                            <Text size="sm" c="dimmed">
                                No cover letter was provided.
                            </Text>
                        )}
                    </Stack>
                </Card>

                {/* Job seeker withdrawal */}
                {canWithdraw && (
                    <Card withBorder radius="lg" padding="xl">
                        <Group justify="space-between" align="center">
                            <Stack gap={2}>
                                <Title order={4}>Withdraw Application</Title>

                                <Text size="sm" c="dimmed">
                                    You can withdraw this application while it
                                    is still being reviewed.
                                </Text>
                            </Stack>

                            <AppButton
                                color="red"
                                variant="light"
                                onClick={withdrawModal.open}
                            >
                                Withdraw Application
                            </AppButton>
                        </Group>
                    </Card>
                )}

                {/* Employer status management */}
                {canUpdateStatus && (
                    <Card withBorder radius="lg" padding="xl">
                        <Stack gap="md">
                            <Stack gap={2}>
                                <Title order={3}>Application Status</Title>

                                <Text size="sm" c="dimmed">
                                    Move this application to the next stage of
                                    the hiring process.
                                </Text>
                            </Stack>

                            {/* Pending → Reviewing */}
                            {application.status === 'pending' && (
                                <Group>
                                    <AppButton
                                        onClick={() =>
                                            confirmStatusChange('reviewing')
                                        }
                                    >
                                        Start Review
                                    </AppButton>
                                </Group>
                            )}

                            {/* Reviewing → Shortlisted / Rejected */}
                            {application.status === 'reviewing' && (
                                <Group>
                                    <AppButton
                                        onClick={() =>
                                            confirmStatusChange('shortlisted')
                                        }
                                    >
                                        Shortlist
                                    </AppButton>

                                    <AppButton
                                        color="red"
                                        variant="light"
                                        onClick={() =>
                                            confirmStatusChange('rejected')
                                        }
                                    >
                                        Reject
                                    </AppButton>
                                </Group>
                            )}

                            {/* Shortlisted → Hired / Rejected */}
                            {application.status === 'shortlisted' && (
                                <Group>
                                    <AppButton
                                        onClick={() =>
                                            confirmStatusChange('hired')
                                        }
                                    >
                                        Hire
                                    </AppButton>

                                    <AppButton
                                        color="red"
                                        variant="light"
                                        onClick={() =>
                                            confirmStatusChange('rejected')
                                        }
                                    >
                                        Reject
                                    </AppButton>
                                </Group>
                            )}

                            {/* Final states */}
                            {(application.status === 'rejected' ||
                                application.status === 'hired' ||
                                application.status === 'withdrawn') && (
                                <Text size="sm" c="dimmed">
                                    This application has reached its final
                                    status and cannot be changed.
                                </Text>
                            )}
                        </Stack>
                    </Card>
                )}
            </Stack>

            {/* Employer status confirmation modal */}
            <ConfirmationModal
                opened={opened}
                onClose={closeStatusModal}
                onConfirm={updateStatus}
                loading={processing}
                title="Update application status"
                confirmLabel={
                    selectedStatus ? statusLabels[selectedStatus] : 'Confirm'
                }
                confirmColor={getConfirmColor()}
                description={
                    <>
                        Change the application status from{' '}
                        <Text component="span" fw={700}>
                            {statusLabels[application.status]}
                        </Text>{' '}
                        to{' '}
                        <Text component="span" fw={700}>
                            {selectedStatus ? statusLabels[selectedStatus] : ''}
                        </Text>
                        ?
                    </>
                }
            />

            {/* Job seeker withdrawal confirmation modal */}
            <ConfirmationModal
                opened={withdrawModalOpened}
                onClose={closeWithdrawModal}
                onConfirm={withdrawApplication}
                loading={withdrawing}
                title="Withdraw application"
                confirmLabel="Withdraw Application"
                confirmColor="red"
                description={
                    <>
                        Are you sure you want to withdraw your application for{' '}
                        <Text component="span" fw={700}>
                            {application.job.title}
                        </Text>
                        ? You will no longer be considered for this position.
                    </>
                }
            />
        </>
    );
}
