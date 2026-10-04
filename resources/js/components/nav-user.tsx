import { usePage } from '@inertiajs/react';
import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { ChevronUp } from 'lucide-react';

import { UserMenuContent } from '@/components/user-menu-content';
import type { SharedData } from '@/types';
type NavUserProps = {
    onNavigate?: () => void;
};
export function NavUser({ onNavigate }: NavUserProps) {
    const { auth } = usePage<SharedData>().props;

    if (!auth.user) {
        return null;
    }

    const initials = auth.user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <Menu position="top-end" offset={5} width={180}>
            <Menu.Target>
                <UnstyledButton
                    w="100%"
                    p="xs"
                    style={{
                        borderRadius: 'var(--mantine-radius-md)',
                    }}
                >
                    <Group wrap="nowrap" gap="sm">
                        <Avatar
                            src={auth.user.avatar}
                            alt={auth.user.name}
                            size="sm"
                            radius="xl"
                        >
                            {initials}
                        </Avatar>

                        <div
                            style={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <Text size="sm" fw={500} truncate>
                                {auth.user.name}
                            </Text>

                            <Text size="xs" c="dimmed" truncate>
                                {auth.user.email}
                            </Text>
                        </div>

                        <ChevronUp size={16} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <UserMenuContent onNavigate={onNavigate} />
            </Menu.Dropdown>
        </Menu>
    );
}
