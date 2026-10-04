import { ActionIcon, Menu } from '@mantine/core';
import { Check, Monitor, Moon, Sun } from 'lucide-react';

import { useAppearance } from '@/hooks/use-appearance';

export default function AppTheme() {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <Menu shadow="md" width={180} position="bottom-end">
            <Menu.Target>
                <ActionIcon
                    variant="subtle"
                    size="lg"
                    aria-label="Change appearance"
                >
                    {appearance === 'light' && <Sun size={18} />}

                    {appearance === 'dark' && <Moon size={18} />}

                    {appearance === 'system' && <Monitor size={18} />}
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Appearance</Menu.Label>

                <Menu.Item
                    leftSection={<Sun size={16} />}
                    rightSection={
                        appearance === 'light' ? <Check size={16} /> : null
                    }
                    onClick={() => updateAppearance('light')}
                >
                    Light
                </Menu.Item>

                <Menu.Item
                    leftSection={<Moon size={16} />}
                    rightSection={
                        appearance === 'dark' ? <Check size={16} /> : null
                    }
                    onClick={() => updateAppearance('dark')}
                >
                    Dark
                </Menu.Item>

                <Menu.Item
                    leftSection={<Monitor size={16} />}
                    rightSection={
                        appearance === 'system' ? <Check size={16} /> : null
                    }
                    onClick={() => updateAppearance('system')}
                >
                    System
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
