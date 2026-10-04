import { Form, Head } from '@inertiajs/react';
import { Button, PasswordInput, Stack } from '@mantine/core';
import { useRef } from 'react';

import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Security settings" />

            <Stack gap="xl">
                <Heading
                    variant="small"
                    title="Update password"
                    description="Ensure your account is using a long, random password to stay secure"
                />

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                >
                    {({ errors, processing }) => (
                        <Stack gap="md">
                            <PasswordInput
                                id="current_password"
                                ref={currentPasswordInput}
                                name="current_password"
                                label="Current password"
                                autoComplete="current-password"
                                placeholder="Current password"
                                error={errors.current_password}
                            />

                            <PasswordInput
                                id="password"
                                ref={passwordInput}
                                name="password"
                                label="New password"
                                autoComplete="new-password"
                                placeholder="New password"
                                error={errors.password}
                                passwordrules={props.passwordRules}
                            />

                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                label="Confirm password"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                error={errors.password_confirmation}
                                passwordrules={props.passwordRules}
                            />

                            <Button
                                type="submit"
                                loading={processing}
                                data-test="update-password-button"
                                w="fit-content"
                            >
                                Save
                            </Button>
                        </Stack>
                    )}
                </Form>
            </Stack>

            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />

            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};
