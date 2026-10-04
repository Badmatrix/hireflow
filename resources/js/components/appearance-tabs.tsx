import { Flex, Group, SegmentedControl } from '@mantine/core';
import { Monitor, Moon, Sun } from 'lucide-react';

import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';

export default function AppearanceToggleTab() {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <Group>
            <SegmentedControl
                value={appearance}
                onChange={(value) => updateAppearance(value as Appearance)}
                data={[
                    {
                        value: 'light',
                        label: (
                            <Flex align={"center"} gap={6}>
                                <Sun size={16} />
                                <span>Light</span>
                            </Flex>
                        ),
                    },
                    {
                        value: 'dark',
                        label: (
                            <Flex align={"center"} gap={6}>
                                <Moon size={16} />
                                <span>Dark</span>
                            </Flex>
                        ),
                    },
                    {
                        value: 'system',
                        label: (
                            <Flex align={"center"} gap={6}>
                                <Monitor size={16} />
                                <span>System</span>
                            </Flex>
                        ),
                    },
                ]}
            />
        </Group>
    );
}
