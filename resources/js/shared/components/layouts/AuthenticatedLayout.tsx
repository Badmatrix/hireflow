import { Link } from '@inertiajs/react';
import {
    AppShell,
    Burger,
    Group,
    NavLink,
    ScrollArea,
    Text,
    UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type AuthenticatedLayoutProps = {
    children: React.ReactNode;
};

export default function AuthenticatedLayout({
    children,
}: AuthenticatedLayoutProps) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 64 }}
            navbar={{
                width: 250,
                breakpoint: 'md',
                collapsed: { mobile: !opened },
            }}
            padding="lg"
        >
            <AppShell.Header>
                <Group h="100%" px="lg" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="md"
                            size="sm"
                        />

                        <Text fw={700} size="xl" c="hireflowBlue.6">
                            HireFlow
                        </Text>
                    </Group>

                    <UnstyledButton>
                        <Text size="sm" fw={500}>
                            Matrix
                        </Text>
                    </UnstyledButton>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <AppShell.Section grow component={ScrollArea}>
                    <NavLink
                        component={Link}
                        href="/dashboard"
                        label="Dashboard"
                    />

                    <NavLink
                        component={Link}
                        href="/companies"
                        label="Companies"
                    />

                    <NavLink component={Link} href="/jobs" label="Jobs" />

                    <NavLink
                        component={Link}
                        href="/applications"
                        label="Applications"
                    />
                </AppShell.Section>

                <AppShell.Section>
                    <NavLink
                        component={Link}
                        href="/settings"
                        label="Settings"
                    />
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
