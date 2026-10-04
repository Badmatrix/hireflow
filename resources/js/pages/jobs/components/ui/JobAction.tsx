import { Link, router, usePage } from '@inertiajs/react';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { Edit, Eye, MoreVertical, Send, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

import ConfirmationModal from '@/shared/components/feedback/AppModal';
import type { Job } from '../../types/job';

type PendingAction = {
    type: 'delete' | 'publish';
    job: Job;
} | null;

type JobActionProps = {
    job: Job;
    isAdmin: boolean;
   
};

export default function JobAction({
    job,
    isAdmin,
   
}: JobActionProps) {
    const { auth } = usePage().props;
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    const [processing, setProcessing] = useState(false);

    const isOwner=job.company?.user_id === auth.user?.id;
    const canManage = isAdmin || isOwner
    const canEdit = isOwner
    const canDelete = canManage;
    const canPublish =  isOwner && job.status === 'draft';

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

        const { type, job: target } = pendingAction;

        if (type === 'delete') {
            router.delete(`/jobs/${target.id}`, {
                preserveScroll: true,

                onFinish: () => {
                    setProcessing(false);
                    setPendingAction(null);
                },
            });

            return;
        }

        router.post(
            `/jobs/${target.id}/publish`,
            {},
            {
                preserveScroll: true,

                onFinish: () => {
                    setProcessing(false);
                    setPendingAction(null);
                },
            },
        );
    };

    return (
        <>
            <Menu shadow="md" width={180} position="bottom-end">
                <Menu.Target>
                    <ActionIcon
                        variant="subtle"
                        size="md"
                        radius="md"
                        aria-label="Job actions"
                    >
                        <MoreVertical size={18} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        component={Link}
                        href={`/jobs/${job.id}`}
                        leftSection={<Eye size={16} />}
                    >
                        View
                    </Menu.Item>

                    {canEdit && (
                        <Menu.Item
                            component={Link}
                            href={`/jobs/${job.id}/edit`}
                            leftSection={<Edit size={16} />}
                        >
                            Edit
                        </Menu.Item>
                    )}

                    {canPublish && (
                        <Menu.Item
                            leftSection={<Send size={16} />}
                            onClick={() =>
                                setPendingAction({
                                    type: 'publish',
                                    job,
                                })
                            }
                        >
                            Publish
                        </Menu.Item>
                    )}
                    {isOwner && (
                        <Menu.Item
                            component={Link}
                            href={`/jobs/${job.id}/applications`}
                            leftSection={<Users size={16} />}
                        >
                            Applications
                        </Menu.Item>
                    )}

                    {canDelete && (
                        <>
                            <Menu.Divider />

                            <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16} />}
                                onClick={() =>
                                    setPendingAction({
                                        type: 'delete',
                                        job,
                                    })
                                }
                            >
                                Delete
                            </Menu.Item>
                        </>
                    )}
                </Menu.Dropdown>
            </Menu>

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
                    pendingAction?.type === 'delete' ? 'Delete' : 'Publish Job'
                }
                confirmColor={
                    pendingAction?.type === 'delete' ? 'red' : 'hireflowBlue.9'
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
                            ? This will make the job visible to job seekers.
                        </>
                    )
                }
            />
        </>
    );
}
