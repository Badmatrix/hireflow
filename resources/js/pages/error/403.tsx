import AppButton from '@/shared/components/ui/AppButton';
import { Head, Link } from '@inertiajs/react';
import {
    Button,
    Center,
    Container,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { ShieldAlert } from 'lucide-react';

export default function Forbidden() {
    return (
        <>
            <Head title="Access Denied" />

            <Center mih="100vh" px="md">
                <Container size={520} w="100%">
                    <Paper
                        withBorder
                        radius="lg"
                        p={{ base: 'xl', sm: 48 }}
                        shadow="sm"
                    >
                        <Stack align="center" gap="lg">
                            <ThemeIcon
                                size={80}
                                radius="xl"
                                variant="light"
                                color="red"
                            >
                                <ShieldAlert size={40} />
                            </ThemeIcon>

                            <Stack align="center" gap={4}>
                                <Text
                                    size="sm"
                                    fw={700}
                                    c="red"
                                    tt="uppercase"
                                    lts={1}
                                >
                                    Error 403
                                </Text>

                                <Title order={1} ta="center">
                                    Access Denied
                                </Title>
                            </Stack>

                            <Text c="dimmed" ta="center" size="md" maw={420}>
                                You do not have permission to access this page
                                or perform this action.
                            </Text>

                            <Link href="/dashboard">
                                <AppButton size="md" radius="md">
                                    Back to Dashboard
                                </AppButton>
                            </Link>
                        </Stack>
                    </Paper>
                </Container>
            </Center>
        </>
    );
}
