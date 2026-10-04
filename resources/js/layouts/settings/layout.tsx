import { Link } from '@inertiajs/react';
import { Box, Grid, NavLink, Stack } from '@mantine/core';
import type { PropsWithChildren } from 'react';

import Heading from '@/components/heading';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <Box px="md" py="xl">
            <Heading
                title="Settings"
                description="Manage your profile and account settings"
            />

            <Grid mt="xl">
                <Grid.Col span={{ base: 12, lg: 3 }}>
                    <Stack gap={4}>
                        {sidebarNavItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.title}
                                    component={Link}
                                    href={item.href}
                                    label={item.title}
                                    active={isCurrentOrParentUrl(item.href)}
                                    leftSection={
                                        Icon ? <Icon size={16} /> : undefined
                                    }
                                    variant="light"
                                />
                            );
                        })}
                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 9 }}>
                    <Box maw={672}>{children}</Box>
                </Grid.Col>
            </Grid>
        </Box>
    );
}
