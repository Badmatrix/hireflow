import { Card, Stack, Text } from "@mantine/core";

export default function EmptyState({ hasSearch }: { hasSearch: boolean }) {
    return (
        <Card withBorder radius="lg" padding="xl">
            <Stack align="center" gap="xs">
                <Text fw={600}>No companies found</Text>

                <Text size="sm" c="dimmed">
                    {hasSearch
                        ? 'Try a different search term.'
                        : 'There are no verified companies available yet.'}
                </Text>
            </Stack>
        </Card>
    );
}
