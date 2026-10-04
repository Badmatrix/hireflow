import { usePage } from '@inertiajs/react';
import { Breadcrumbs, Burger, Group, Text } from '@mantine/core';

import NotificationMenu from '@/shared/components/feedback/NotificationMenu';
import type { BreadcrumbItem } from '@/types';
import AppTheme from './app-theme';

type AppSidebarHeaderProps = {
    breadcrumbs?: BreadcrumbItem[];
    opened: boolean;
    onToggle: () => void;
};

export function AppSidebarHeader({
    breadcrumbs = [],
    opened,
    onToggle,
}: AppSidebarHeaderProps) {
    const { auth } = usePage().props
    const isJobSeeker = auth.user.role.name === 'job seeker'
    

    return (
        <Group h="100%" px="lg" justify="space-between" py="xs">
            <Group gap="md">
                <Burger
                    hiddenFrom="md"
                    opened={opened}
                    onClick={onToggle}
                    size="sm"
                    aria-label="Toggle navigation"
                />

                {breadcrumbs.length > 0 && (
                    <Breadcrumbs>
                        {breadcrumbs.map((item) => (
                            <Text key={item.title} size="sm" c="dimmed">
                                {item.title}
                            </Text>
                        ))}
                    </Breadcrumbs>
                )}
            </Group>

            <Group gap="xs">
                {isJobSeeker && <NotificationMenu />}

                {/* Appearance */}
                <AppTheme />
            </Group>
        </Group>
    );
}
