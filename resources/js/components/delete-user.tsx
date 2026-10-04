import { Form } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Group,
    Modal,
    PasswordInput,
    Stack,
    Text,
} from '@mantine/core';
import { useRef, useState } from 'react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import AppButton from '@/shared/components/ui/AppButton';


export default function DeleteUser() {
    const [opened, setOpened] = useState(false);

    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <Stack gap="xl">
            <Heading
                variant="small"
                title="Delete account"
                description="Delete your account and all of its resources"
            />

            <Alert color="red" variant="light" title="Warning">
                <Stack gap="md">
                    <Text size="sm">
                        Please proceed with caution. This action cannot be
                        undone.
                    </Text>

                    <Box>
                        {' '}
                        <AppButton
                            color="red"
                            variant="filled"
                            onClick={() => setOpened(true)}
                            data-test="delete-user-button"
                        >
                            Delete account
                        </AppButton>
                    </Box>
                </Stack>
            </Alert>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Are you sure you want to delete your account?"
                centered
            >
                <Form
                    {...ProfileController.destroy.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    onError={() => passwordInput.current?.focus()}
                    resetOnSuccess
                >
                    {({ resetAndClearErrors, processing, errors }) => (
                        <Stack gap="md">
                            <Text size="sm" c="dimmed">
                                Once your account is deleted, all of its
                                resources and data will also be permanently
                                deleted. Please enter your password to confirm
                                that you want to permanently delete your
                                account.
                            </Text>

                            <PasswordInput
                                id="password"
                                name="password"
                                ref={passwordInput}
                                label="Password"
                                placeholder="Password"
                                autoComplete="current-password"
                                error={errors.password}
                            />

                            <Group justify="flex-end" mt="md">
                                <AppButton
                                    variant="default"
                                    onClick={() => {
                                        resetAndClearErrors();
                                        setOpened(false);
                                    }}
                                >
                                    Cancel
                                </AppButton>

                                <AppButton
                                    type="submit"
                                    color="red"
                                    loading={processing}
                                    data-test="confirm-delete-user-button"
                                >
                                    Delete account
                                </AppButton>
                            </Group>
                        </Stack>
                    )}
                </Form>
            </Modal>
        </Stack>
    );
}
