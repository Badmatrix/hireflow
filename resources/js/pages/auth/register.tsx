import { Form, Head } from '@inertiajs/react';
import { Radio, Stack, Text, PasswordInput } from '@mantine/core';

import TextLink from '@/components/text-link';
import { login } from '@/routes';
import { store } from '@/routes/register';
import AppButton from '@/shared/components/ui/AppButton';
import AppTextInput from '@/shared/components/ui/AppTextInput';

export default function Register() {
    return (
        <>
            <Head title="Create an account" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
            >
                {({ processing, errors }) => (
                    <Stack gap="lg">
                        <AppTextInput
                            label="Full name"
                            name="name"
                            required
                            autoFocus
                            autoComplete="name"
                            placeholder="Enter your full name"
                            error={errors.name}
                        />

                        <AppTextInput
                            label="Email address"
                            type="email"
                            name="email"
                            required
                            autoComplete="email"
                            placeholder="email@example.com"
                            error={errors.email}
                        />

                        <Radio.Group
                            name="account_type"
                            label="Account type"
                            description="Choose how you want to use HireFlow."
                            defaultValue="job_seeker"
                            error={errors.account_type}
                            required
                        >
                            <Stack gap="sm" mt="xs">
                                <Radio value="job_seeker" label="Job Seeker" />

                                <Radio value="employer" label="Employer" />
                            </Stack>
                        </Radio.Group>

                        <PasswordInput
                            label="Password"
                            name="password"
                            required
                            autoComplete="new-password"
                            placeholder="Create a password"
                            error={errors.password}
                            description="Use a strong password to keep your account secure."
                        />

                        <PasswordInput
                            label="Confirm password"
                            name="password_confirmation"
                            required
                            autoComplete="new-password"
                            placeholder="Confirm your password"
                            error={errors.password_confirmation}
                        />

                        <AppButton
                            type="submit"
                            loading={processing}
                            fullWidth
                            size="md"
                        >
                            Create account
                        </AppButton>

                        <Text ta="center" size="sm" c="dimmed">
                            Already have an account?{' '}
                            <TextLink href={login()}>Log in</TextLink>
                        </Text>
                    </Stack>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
