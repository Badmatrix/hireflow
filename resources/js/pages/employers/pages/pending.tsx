import { Head } from '@inertiajs/react';
import {
    Center,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { Clock3 } from 'lucide-react';


export default function Pending() {
    return (
        <>
            <Head title="Employer verification pending" />

            <Center mih="60vh">
                <Paper withBorder radius="lg" p="xl" maw={520} w="100%">
                    <Stack align="center" gap="md">
                        <ThemeIcon size={64} radius="xl" variant="light">
                            <Clock3 size={32} />
                        </ThemeIcon>

                        <Title order={2} ta="center">
                            Employer verification pending
                        </Title>

                        <Text c="dimmed" ta="center" lh={1.6}>
                            Your employer account has been created successfully.
                            An administrator needs to review and approve your
                            account before you can create companies or post
                            jobs.
                        </Text>

                        

                        <Text size="sm" c="dimmed" ta="center">
                            You can leave this page. Once an administrator
                            approves your account, you’ll be able to access the
                            employer dashboard and management features.
                        </Text>
                    </Stack>
                </Paper>
            </Center>
        </>
    );
}

Pending.layout = {
    breadcrumbs: [
        {
            title: 'Employer verification',
            href: '/employer/pending',
        },
    ],
};
