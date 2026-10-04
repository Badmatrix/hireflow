import { usePage } from '@inertiajs/react';
import { AppShell, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import FlashNotification from '@/shared/components/feedback/FlashNotification';
import type { AppLayoutProps, SharedData } from '@/types';

const NAVBAR_WIDTH = 250;
const HEADER_HEIGHT = 64;

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const [opened, { toggle, close }] = useDisclosure(false);

    const { flash } = usePage<SharedData>().props;

    return (
        <AppShell
            navbar={{
                width: NAVBAR_WIDTH,
                breakpoint: 'md',
                collapsed: {
                    mobile: !opened,
                },
            }}
            header={{
                height: HEADER_HEIGHT,
            }}
            padding={0}
        >
            {/* Sidebar */}
            <AppShell.Navbar>
                <AppSidebar onNavigate={close} />
            </AppShell.Navbar>

            {/* Header */}
            <AppShell.Header
                style={{
                    left: `var(--app-shell-navbar-offset)`,
                    width: 'calc(100% - var(--app-shell-navbar-offset))',
                }}
            >
                <AppSidebarHeader
                    breadcrumbs={breadcrumbs}
                    opened={opened}
                    onToggle={toggle}
                />
            </AppShell.Header>

            {/* Main content */}
            <AppShell.Main>
                <FlashNotification flash={flash} />

                <Container fluid px="xl" py="xl">
                    {children}
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
