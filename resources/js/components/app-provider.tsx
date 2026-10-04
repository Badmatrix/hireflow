import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import type { ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import { theme } from '@/shared/theme/theme';

type AppProvidersProps = {
    children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
    const { resolvedAppearance } = useAppearance();

    return (
        <MantineProvider theme={theme} forceColorScheme={resolvedAppearance}>
            <Notifications position="top-right" />
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </MantineProvider>
    );
}
