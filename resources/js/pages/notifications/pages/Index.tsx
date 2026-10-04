import { Link, router } from '@inertiajs/react';
import { Card, Group, Paper, Stack, Text, Title } from '@mantine/core';
import {
    Bell,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    XCircle,
} from 'lucide-react';

import AppPagination from '@/shared/components/ui/app-pagination';
import AppButton from '@/shared/components/ui/AppButton';
import { formatDate } from '@/shared/constant/helper';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type { NotificationData, NotificationType } from '../types/Notification';

type Props = {
    notifications: PaginatedResponse<NotificationType>;
};

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    reviewing: 'Reviewing',
    shortlisted: 'Shortlisted',
    rejected: 'Rejected',
    hired: 'Hired',
};

type StatusConfig = {
    label: string;
    icon: typeof Bell;
    color: string;
    background: string;
};

function getStatusConfig(status: string): StatusConfig {
    switch (status) {
        case 'shortlisted':
            return {
                label: 'Shortlisted',
                icon: CheckCircle2,
                color: 'green',
                background: 'green.0',
            };

        case 'hired':
            return {
                label: 'Hired',
                icon: CheckCircle2,
                color: 'green',
                background: 'green.0',
            };

        case 'rejected':
            return {
                label: 'Rejected',
                icon: XCircle,
                color: 'red',
                background: 'red.0',
            };

        case 'reviewing':
            return {
                label: 'Reviewing',
                icon: Clock3,
                color: 'orange',
                background: 'orange.0',
            };

        default:
            return {
                label: statusLabels[status] ?? status,
                icon: Bell,
                color: 'blue',
                background: 'blue.0',
            };
    }
}

function getNotificationMessage(data: NotificationData) {
    const oldStatus = statusLabels[data.old_status] ?? data.old_status;
    const newStatus = statusLabels[data.new_status] ?? data.new_status;

    return (
        <>
            Your application for{' '}
            <Text component="span" fw={600} c="inherit">
                {data.job_title}
            </Text>{' '}
            at{' '}
            <Text component="span" fw={600} c="inherit">
                {data.company_name}
            </Text>{' '}
            has changed from{' '}
            <Text component="span" fw={600} c="inherit">
                {oldStatus}
            </Text>{' '}
            to{' '}
            <Text component="span" fw={600} c="inherit">
                {newStatus}
            </Text>
            .
        </>
    );
}

export default function Index({ notifications }: Props) {
    const hasUnread = notifications.data.some(
        (notification) => notification.read_at === null,
    );

    const handleMarkAllAsRead = () => {
        router.patch(
            '/notifications/read-all',
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <Stack gap="xl">
            {/* Header */}
            <Group
                justify="space-between"
                align="flex-end"
                gap="md"
                wrap="wrap"
            >
                <Group gap="md" align="flex-start">
                    <Paper withBorder radius="md" p="sm" bg="blue.0" c="blue.8">
                        <Bell size={22} strokeWidth={2} />
                    </Paper>

                    <Stack gap={2}>
                        <Title order={2}>Notifications</Title>

                        <Text size="sm" c="dimmed">
                            Stay updated on your applications and activity.
                        </Text>
                    </Stack>
                </Group>

                {hasUnread && (
                    <AppButton
                        variant="subtle"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                    >
                        Mark all as read
                    </AppButton>
                )}
            </Group>

            {/* Notification list */}
            {notifications.data.length === 0 ? (
                <Paper withBorder radius="lg" p={{ base: 'xl', sm: 60 }}>
                    <Stack align="center" gap="sm">
                        <Paper withBorder radius="xl" p="md" bg="gray.0">
                            <Bell size={32} strokeWidth={1.7} />
                        </Paper>

                        <Text fw={600} size="lg">
                            No notifications
                        </Text>

                        <Text size="sm" c="dimmed" ta="center" maw={420}>
                            You don't have any notifications yet. We'll let you
                            know when something important happens.
                        </Text>
                    </Stack>
                </Paper>
            ) : (
                <Stack gap="sm">
                    {notifications.data.map((notification) => {
                        const data = notification.data;
                        const unread = notification.read_at === null;
                        const status = getStatusConfig(data.new_status);
                        const StatusIcon = status.icon;

                        return (
                            <Card
                                key={notification.id}
                                component={Link}
                                href={`/notifications/${notification.id}/read`}
                                method="patch"
                                preserveScroll
                                withBorder
                                radius="lg"
                                padding={0}
                                style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                }}
                            >
                                {unread && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: '0 auto 0 0',
                                            width: 3,
                                            background:
                                                'var(--mantine-color-blue-6)',
                                        }}
                                    />
                                )}

                                <Group
                                    align="flex-start"
                                    gap="md"
                                    wrap="nowrap"
                                    p={{ base: 'md', sm: 'lg' }}
                                >
                                    {/* Status icon */}
                                    <Paper
                                        radius="md"
                                        p="sm"
                                        bg={status.background}
                                        c={`${status.color}.7`}
                                        style={{
                                            flexShrink: 0,
                                        }}
                                    >
                                        <StatusIcon size={21} strokeWidth={2} />
                                    </Paper>

                                    {/* Content */}
                                    <Stack
                                        gap="xs"
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Group
                                            justify="space-between"
                                            align="flex-start"
                                            gap="sm"
                                            wrap="nowrap"
                                        >
                                            <Text
                                                size="sm"
                                                fw={unread ? 700 : 600}
                                                c={
                                                    unread
                                                        ? undefined
                                                        : 'dimmed'
                                                }
                                            >
                                                Application status updated
                                            </Text>

                                            {unread && (
                                                <Paper
                                                    radius="xl"
                                                    w={8}
                                                    h={8}
                                                    bg="blue.6"
                                                    style={{
                                                        flexShrink: 0,
                                                        marginTop: 5,
                                                    }}
                                                />
                                            )}
                                        </Group>

                                        <Text
                                            size="sm"
                                            lh={1.65}
                                            textWrap="wrap"
                                            ta="left"

                                            c={unread ? undefined : 'dimmed'}
                                        >
                                            {getNotificationMessage(data)}
                                        </Text>

                                        {/* Metadata */}
                                        <Group gap="xs" mt={4} wrap="wrap">
                                            <Group gap={5}>
                                                <BriefcaseBusiness
                                                    size={14}
                                                    strokeWidth={1.8}
                                                />

                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    truncate
                                                    maw={{
                                                        base: 180,
                                                        sm: 300,
                                                    }}
                                                >
                                                    {data.job_title}
                                                </Text>
                                            </Group>

                                            <Text size="xs" c="dimmed">
                                                ·
                                            </Text>

                                            <Text size="xs" c="dimmed">
                                                {formatDate(
                                                    notification.created_at,
                                                )}
                                            </Text>
                                        </Group>
                                    </Stack>
                                </Group>
                            </Card>
                        );
                    })}
                </Stack>
            )}

            {notifications.data.length > 0 && (
                <AppPagination data={notifications} />
            )}
        </Stack>
    );
}
