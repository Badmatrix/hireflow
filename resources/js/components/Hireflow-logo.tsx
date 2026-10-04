import { Box, Text } from '@mantine/core';
import React from 'react';

export default function HireflowLogo() {
    return (
        <Box px="sm" mb="xl">
            <Text size="xl" fw={700} c="hireflowBlue.6">
                HireFlow
            </Text>

            <Text size="xs" c="dimmed">
                Employment platform
            </Text>
        </Box>
    );
}
