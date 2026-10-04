import { Avatar, Group, Stack, Text } from '@mantine/core';

import type { User } from '@/types';

type UserInfoProps = {
    user: User;
    showEmail?: boolean;
};

export function UserInfo({ user, showEmail = false }: UserInfoProps) {
    const initials = user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <Group gap="sm" wrap="nowrap">
            <Avatar src={user.avatar} alt={user.name} size="sm" radius="xl">
                {initials}
            </Avatar>

            <Stack
                gap={0}
                style={{
                    minWidth: 0,
                }}
            >
                <Text size="sm" fw={500} truncate>
                    {user.name}
                </Text>

                {showEmail && (
                    <Text size="xs" c="dimmed" truncate>
                        {user.email}
                    </Text>
                )}
            </Stack>
        </Group>
    );
}
