import { Link, router, usePage } from '@inertiajs/react';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { Edit, EyeIcon, MoreVertical, ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';

import ConfirmationModal from '@/shared/components/feedback/AppModal';
import type { Company } from '../../types/company';

type PendingAction = {
    type: 'delete' | 'verify';
    company: Company;
} | null;

export default function CompanyAction({ company }: { company: Company }) {
    const { auth } = usePage().props;

    const userRole = auth.user?.role?.name;

    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    const [processing, setProcessing] = useState(false);

    const canManageCompany =
        userRole === 'admin' || company.user_id === auth.user?.id;

    const canVerify = userRole === 'admin' && !company.is_verified;

    const hasActions = canManageCompany || canVerify;

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

        const { type, company: target } = pendingAction;

        if (type === 'delete') {
            router.delete(`/companies/${target.id}`, {
                preserveScroll: true,

                onFinish: () => {
                    setProcessing(false);
                    setPendingAction(null);
                },
            });

            return;
        }

        router.post(
            `/companies/${target.id}/verify`,
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

    if (!hasActions) {
        return null;
    }

    return (
        <>
            <Menu shadow="md" width={180} position="bottom-end">
                <Menu.Target>
                    <ActionIcon
                        variant="subtle"
                        size="md"
                        radius="md"
                        aria-label="Company actions"
                    >
                        <MoreVertical size={18} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        component={Link}
                        href={`/companies/${company.id}`}
                        leftSection={<EyeIcon size={16} />}
                    >
                        view
                    </Menu.Item>
                    {canManageCompany && (
                        <Menu.Item
                            component={Link}
                            href={`/companies/${company.id}/edit`}
                            leftSection={<Edit size={16} />}
                        >
                            Edit
                        </Menu.Item>
                    )}

                    {canVerify && (
                        <Menu.Item
                            leftSection={<ShieldCheck size={16} />}
                            onClick={() =>
                                setPendingAction({
                                    type: 'verify',
                                    company,
                                })
                            }
                        >
                            Verify
                        </Menu.Item>
                    )}

                    {canManageCompany && (
                        <>
                            <Menu.Divider />

                            <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16} />}
                                onClick={() =>
                                    setPendingAction({
                                        type: 'delete',
                                        company,
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
                        ? 'Delete company'
                        : 'Verify company'
                }
                confirmLabel={
                    pendingAction?.type === 'delete'
                        ? 'Delete'
                        : 'Verify Company'
                }
                confirmColor={
                    pendingAction?.type === 'delete' ? 'red' : 'hireflowBlue.9'
                }
                description={
                    pendingAction?.type === 'delete' ? (
                        <>
                            Are you sure you want to delete{' '}
                            <Text component="span" fw={700}>
                                {pendingAction.company.name}
                            </Text>
                            ? This action cannot be undone.
                        </>
                    ) : (
                        <>
                            Verify{' '}
                            <Text component="span" fw={700}>
                                {pendingAction?.company.name}
                            </Text>
                            ? This will make the company visible in the public
                            company directory.
                        </>
                    )
                }
            />
        </>
    );
}
