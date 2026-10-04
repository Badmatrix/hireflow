import { Link, router, usePage } from '@inertiajs/react';
import { Avatar, Box, Group, Menu, Text, UnstyledButton } from '@mantine/core';

import type { Auth } from '@/types/auth';

type SharedPageProps = {
    auth: Auth;
};

type AppUserMenuProps = {
    onNavigate?: () => void;
};

export default function AppUserMenu({ onNavigate }: AppUserMenuProps) {
    const { auth } = usePage<SharedPageProps>().props;

    const user = auth.user;

    const handleLogout = () => {
        router.post('/logout');
        
    };

    return (
        <Menu position="top-start" width={220} shadow="md">
            <Menu.Target>
                <UnstyledButton w="100%">
                    <Group gap="sm">
                        <Avatar
                            src={user.avatar}
                            alt={user.name}
                            size="sm"
                            radius="xl"
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box
                            style={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <Text size="sm" fw={600} truncate>
                                {user.name}
                            </Text>

                            <Text size="xs" c="dimmed" truncate>
                                {user.email}
                            </Text>
                        </Box>
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>

                <Menu.Item
                    component={Link}
                    href="/settings/profile"
                    onClick={onNavigate}
                >
                    Profile
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item color="red" onClick={handleLogout}>
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
