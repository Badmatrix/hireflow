import { Link, router } from '@inertiajs/react';
import { ActionIcon, Menu } from '@mantine/core';
import {
    Check,
    Eye,
    MoreVertical,
    RotateCcw,
    ThumbsDown,
    UserCheck,

} from 'lucide-react';
import { useState } from 'react';

import ConfirmationModal from '@/shared/components/feedback/AppModal';
import type { Application } from '../../types/application';


type Status = 'reviewing' | 'shortlisted' | 'rejected' | 'hired' | 'pending';

type Props = {
    application: Application;
};

export default function ApplicationAction({ application }: Props) {
    const [pendingStatus, setPendingStatus] = useState<Status | null>(null);

    const [processing, setProcessing] = useState(false);

    const closeModal = () => {
        if (processing) {
            return;
        }

        setPendingStatus(null);
    };

    const handleConfirm = () => {
        if (!pendingStatus) {
            return;
        }

        setProcessing(true);

        router.patch(
            `/applications/${application.id}/status`,
            {
                status: pendingStatus,
            },
            {
                preserveScroll: true,

                onFinish: () => {
                    setProcessing(false);
                    setPendingStatus(null);
                },
            },
        );
    };

    const statusConfig = {
        pending: {
            label: 'Mark as Pending',
            icon: <RotateCcw size={16} />,
        },
        reviewing: {
            label: 'Move to Reviewing',
            icon: <Check size={16} />,
        },
        shortlisted: {
            label: 'Shortlist',
            icon: <UserCheck size={16} />,
        },
        rejected: {
            label: 'Reject',
            icon: <ThumbsDown size={16} />,
        },
        hired: {
            label: 'Mark as Hired',
            icon: <Check size={16} />,
        },
    };

    return (
        <>
            <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                    <ActionIcon
                        variant="subtle"
                        size="md"
                        radius="md"
                        aria-label="Application actions"
                    >
                        <MoreVertical size={18} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        component={Link}
                        href={`/applications/${application.id}`}
                        leftSection={<Eye size={15} />}
                    >
                        Review
                    </Menu.Item>
                    {application.status !== 'pending' && (
                        <Menu.Item
                            leftSection={statusConfig.pending.icon}
                            onClick={() => setPendingStatus('pending')}
                        >
                            {statusConfig.pending.label}
                        </Menu.Item>
                    )}

                    {application.status !== 'reviewing' && (
                        <Menu.Item
                            leftSection={statusConfig.reviewing.icon}
                            onClick={() => setPendingStatus('reviewing')}
                        >
                            {statusConfig.reviewing.label}
                        </Menu.Item>
                    )}

                    {application.status !== 'shortlisted' && (
                        <Menu.Item
                            leftSection={statusConfig.shortlisted.icon}
                            onClick={() => setPendingStatus('shortlisted')}
                        >
                            {statusConfig.shortlisted.label}
                        </Menu.Item>
                    )}

                    {application.status !== 'hired' && (
                        <Menu.Item
                            leftSection={statusConfig.hired.icon}
                            onClick={() => setPendingStatus('hired')}
                        >
                            {statusConfig.hired.label}
                        </Menu.Item>
                    )}

                    {application.status !== 'rejected' && (
                        <>
                            <Menu.Divider />

                            <Menu.Item
                                color="red"
                                leftSection={statusConfig.rejected.icon}
                                onClick={() => setPendingStatus('rejected')}
                            >
                                {statusConfig.rejected.label}
                            </Menu.Item>
                        </>
                    )}
                </Menu.Dropdown>
            </Menu>

            <ConfirmationModal
                opened={pendingStatus !== null}
                onClose={closeModal}
                onConfirm={handleConfirm}
                loading={processing}
                title="Update application status"
                confirmLabel="Update Status"
                confirmColor={
                    pendingStatus === 'rejected' ? 'red' : 'hireflowBlue.9'
                }
                description={
                    <>
                        Change <strong>{application.user.name}</strong>
                        's application status to{' '}
                        <strong>{pendingStatus}</strong>?
                    </>
                }
            />
        </>
    );
}
