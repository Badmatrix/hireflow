import { Link, router, usePage } from '@inertiajs/react';
import {
    ActionIcon,
    Badge,
    Divider,
    Group,
    Menu,
    Stack,
    Text,
    ThemeIcon,
} from '@mantine/core';
import { Bell, Check, FileText } from 'lucide-react';

import type { NotificationType } from '@/pages/notifications/types/Notification';


type PageProps = {
    notificationMenu?: NotificationType[];
    unreadNotificationCount?: number;
};

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    reviewing: 'Reviewing',
    shortlisted: 'Shortlisted',
    rejected: 'Rejected',
    hired: 'Hired',
    withdrawn: 'Withdrawn',
};

export default function NotificationMenu() {
    const {
        notificationMenu: notifications = [],
        unreadNotificationCount = 0,
    } = usePage<PageProps>().props;


    const markAsRead = (id: string) => {
        router.patch(
            `/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <Menu width={360} position="bottom-end" shadow="md" withArrow>
            <Menu.Target>
                <ActionIcon
                    variant="subtle"
                    size="lg"
                    aria-label="Notifications"
                    pos="relative"
                >
                    <Bell size={20} />

                    {unreadNotificationCount > 0 && (
                        <Badge
                            size="xs"
                            circle
                            color="red"
                            pos="absolute"
                            top={2}
                            right={2}
                            style={{
                                pointerEvents: 'none',
                            }}
                        >
                            {unreadNotificationCount > 9
                                ? '9+'
                                : unreadNotificationCount}
                        </Badge>
                    )}
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Group justify="space-between" align="center">
                    <Menu.Label>Notifications</Menu.Label>

                    {unreadNotificationCount > 0 && (
                        <Text
                            size="xs"
                            c="dimmed"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                router.patch(
                                    '/notifications/read-all',
                                    {},
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    },
                                );
                            }}
                        >
                            Mark all as read
                        </Text>
                    )}
                </Group>

                {notifications.length === 0 ? (
                    <Stack align="center" gap="xs" py="lg">
                        <ThemeIcon variant="light" size="lg">
                            <Bell size={16} />
                        </ThemeIcon>

                        <Text size="sm" c="dimmed">
                            No notifications
                        </Text>
                    </Stack>
                ) : (
                    <Stack gap={0}>
                        {notifications
                            .slice(0, 5)
                            .map((notification, index) => {
                                const data = notification.data;
                                const unread = notification.read_at === null;

                                return (
                                    <div key={notification.id}>
                                        <Menu.Item
                                            component={Link}
                                            href={`/applications/${data.application_id}`}
                                            onClick={() => {
                                                if (unread) {
                                                    markAsRead(notification.id);
                                                }
                                            }}
                                            leftSection={
                                                <ThemeIcon
                                                    variant="light"
                                                    size="md"
                                                >
                                                    <FileText size={15} />
                                                </ThemeIcon>
                                            }
                                            rightSection={
                                                unread ? (
                                                    <ActionIcon
                                                        variant="subtle"
                                                        size="sm"
                                                        aria-label="Mark as read"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();

                                                            markAsRead(
                                                                notification.id,
                                                            );
                                                        }}
                                                    >
                                                        <Check size={15} />
                                                    </ActionIcon>
                                                ) : undefined
                                            }
                                        >
                                            <Stack gap={2}>
                                                <Text
                                                    size="sm"
                                                    fw={unread ? 700 : 500}
                                                >
                                                    Application update
                                                </Text>

                                                <Text
                                                    size="xs"
                                                    c={
                                                        unread
                                                            ? undefined
                                                            : 'dimmed'
                                                    }
                                                >
                                                    Your application for{' '}
                                                    <strong>
                                                        {data.job_title}
                                                    </strong>{' '}
                                                    is now{' '}
                                                    <strong>
                                                        {statusLabels[
                                                            data.new_status
                                                        ] ?? data.new_status}
                                                    </strong>
                                                    .
                                                </Text>

                                                <Text size="xs" c="dimmed">
                                                    {data.company_name}
                                                </Text>
                                            </Stack>
                                        </Menu.Item>

                                        {index < notifications.length - 1 && (
                                            <Divider />
                                        )}
                                    </div>
                                );
                            })}

                        <Menu.Item
                            component={Link}
                            href="/notifications"
                            ta="center"
                        >
                            <Text size="sm" fw={600}>
                                View all notifications
                            </Text>
                        </Menu.Item>
                    </Stack>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}
