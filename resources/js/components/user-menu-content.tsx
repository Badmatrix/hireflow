import { Link, router } from '@inertiajs/react';
import { Menu } from '@mantine/core';
import { LogOut, Settings } from 'lucide-react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
type UserMenuContentProps = {
    onNavigate?: () => void;
};
export function UserMenuContent({ onNavigate }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <Menu.Item
                component={Link}
                href={edit()}
                prefetch
                leftSection={<Settings size={16} />}
                onClick={() => {
                    onNavigate?.();
                    cleanup();
                }}
            >
                Settings
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item
                component={Link}
                href={logout()}
                as="button"
                color="red"
                leftSection={<LogOut size={16} />}
                onClick={handleLogout}
                data-test="logout-button"
            >
                Log out
            </Menu.Item>
        </>
    );
}
