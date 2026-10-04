import { Link, usePage } from '@inertiajs/react';
import { Box, Divider, Flex, NavLink, ScrollArea, Stack } from '@mantine/core';
import {
    BriefcaseBusiness,
    Building2,
    FileText,
    Forward,
    LayoutDashboard,
    Users,
} from 'lucide-react';

import { NavUser } from '@/components/nav-user';
import type { Role } from '@/shared/types/auth';
import HireflowLogo from './Hireflow-logo';

type AppSidebarProps = {
    onNavigate?: () => void;
};

type AuthUser = {
    id: number;
    role?: Role;
};

type PageProps = {
    auth: {
        user: AuthUser;
    };
};

type NavItem = {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
};

export function AppSidebar({ onNavigate }: AppSidebarProps) {
    const page = usePage<PageProps>();
    const { auth } = page.props;
    const url = page.url;

    const role = auth.user?.role?.name;

    const isAdmin = role === 'admin';
    const isEmployer = role === 'employer';
    const isJobSeeker = role === 'job seeker';

    const mainNavItems: NavItem[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },

        // Admin
        ...(isAdmin
            ? [
                  {
                      label: 'Users',
                      href: '/users',
                      icon: Users,
                  },
                  {
                      label: 'Companies',
                      href: '/companies',
                      icon: Building2,
                  },
              ]
            : []),

        // Employer
        ...(isEmployer
            ? [
                  {
                      label: 'Companies',
                      href: '/companies',
                      icon: Building2,
                  },
                  {
                      label: 'Jobs',
                      href: '/jobs',
                      icon: BriefcaseBusiness,
                  },
                  {
                      label: 'Applications',
                      href: '/employer/applications',
                      icon: Forward,
                  },
              ]
            : []),

        // Job seeker
        ...(isJobSeeker
            ? [
                  {
                      label: 'Companies',
                      href: '/companies/browse',
                      icon: Building2,
                  },
                  {
                      label: 'Jobs',
                      href: '/jobs/browse',
                      icon: BriefcaseBusiness,
                  },
                  {
                      label: 'Applications',
                      href: '/applications',
                      icon: Forward,
                  },
                  {
                      label: 'Resumes',
                      href: '/resumes',
                      icon: FileText,
                  },
              ]
            : []),
    ];

   const isActive = (path: string) => {
       return url.startsWith(path);
   };

    return (
        <Flex direction="column" h="100%" mih={0}>
            {/* Logo */}
            <Flex
                align="center"
                justify="space-between"
                h={64}
                px="md"
                style={{
                    flexShrink: 0,
                }}
            >
                <Link
                    href="/"
                    onClick={onNavigate}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <HireflowLogo />
                </Link>
            </Flex>

            {/* Navigation */}
            <ScrollArea
                style={{
                    flex: 1,
                    minHeight: 0,
                }}
                px="sm"
                py="lg"
            >
                <Stack gap={4}>
                    {mainNavItems.map((item) => (
                        <NavLink
                            key={item.label}
                            component={Link}
                            href={item.href}
                            label={item.label}
                            leftSection={<item.icon size={18} />}
                            active={isActive(item.href)}
                            onClick={onNavigate}
                            variant="light"
                            styles={{
                                root: {
                                    borderRadius: 'var(--mantine-radius-md)',
                                },
                            }}
                        />
                    ))}
                </Stack>
            </ScrollArea>

            {/* User */}
            <Box
                style={{
                    flexShrink: 0,
                }}
            >
                <Divider />

                <Box p="sm">
                    <NavUser onNavigate={onNavigate} />
                </Box>
            </Box>
        </Flex>
    );
}
