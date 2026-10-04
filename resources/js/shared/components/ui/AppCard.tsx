import type { PaperProps } from '@mantine/core';
import { Paper } from '@mantine/core';

export default function AppCard(props: PaperProps) {
    return <Paper withBorder p="lg" {...props} />;
}
