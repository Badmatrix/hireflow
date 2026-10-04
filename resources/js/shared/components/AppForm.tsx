import {
    Box,
    Container,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import type { FormEventHandler, ReactNode } from 'react';

type AppFormProps = {
    onSubmit: FormEventHandler<HTMLFormElement>;

    title: string;
    description?: string;

    maw?: number | string;

    children: ReactNode;
    actions?: ReactNode;
};

export default function AppForm({
    onSubmit,
    title,
    description,
    maw,
    children,
    actions,
}: AppFormProps) {
    return (
        <Container size="md">
            <Paper
                withBorder
                radius="lg"
                p={{ base: 'md', sm: 'xl' }}
                maw={maw}
            >
                <form onSubmit={onSubmit}>
                    <Stack gap="xl">
                        {/* Header */}
                        <Box>
                            <Title order={3}>{title}</Title>

                            {description && (
                                <Text size="sm" c="dimmed" mt={4}>
                                    {description}
                                </Text>
                            )}
                        </Box>

                        <Divider />

                        {/* Form content */}
                        {children}

                        {/* Actions */}
                        {actions && (
                            <>
                                <Divider />
                                <Group justify="flex-end">{actions}</Group>
                            </>
                        )}
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
