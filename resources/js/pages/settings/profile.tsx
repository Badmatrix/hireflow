import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    Avatar,
    Box,
    Button,
    Divider,
    FileButton,
    Group,
    Stack,
    Text,
} from '@mantine/core';
import { useState } from 'react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import AppButton from '@/shared/components/ui/AppButton';
import AppTextInput from '@/shared/components/ui/AppTextInput';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

type ProfileProps = {
    mustVerifyEmail: boolean;
    status?: string;
};

export default function Profile({ mustVerifyEmail, status }: ProfileProps) {
    const getInitials = useInitials();
    const { auth } = usePage<PageProps>().props;

    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        auth.user.avatar ? `/storage/${auth.user.avatar}` : null,
    );

    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const handleAvatarChange = (file: File | null) => {
        setAvatarFile(file);

        if (!file) {
            setAvatarPreview(
                auth.user.avatar ? `/storage/${auth.user.avatar}` : null,
            );

            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setAvatarPreview(previewUrl);
    };

    return (
        <>
            <Head title="Profile settings" />

            <Text
                component="h1"
                style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }}
            >
                Profile settings
            </Text>

            <Stack gap="xl">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your personal information"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    transform={(data) => ({
                        ...data,
                        avatar: avatarFile,
                    })}
                >
                    {({ processing, errors }) => (
                        <Stack gap="xl">
                            <Stack gap="md">
                                <Text fw={600}>Profile photo</Text>

                                <Group align="center" gap="lg">
                                    <Avatar
                                        src={avatarPreview}
                                        alt={auth.user.name}
                                        size={96}
                                        radius="xl"
                                    >
                                        {getInitials(auth.user.name)}
                                    </Avatar>

                                    <Stack gap="xs">
                                        <Group gap="sm">
                                            <FileButton
                                                onChange={handleAvatarChange}
                                                accept="image/png,image/jpeg,image/webp"
                                            >
                                                {(props) => (
                                                    <Button
                                                        {...props}
                                                        variant="light"
                                                    >
                                                        {avatarPreview
                                                            ? 'Change photo'
                                                            : 'Upload photo'}
                                                    </Button>
                                                )}
                                            </FileButton>

                                            {auth.user.avatar && (
                                                <Link
                                                    href="/settings/profile/avatar"
                                                    method="delete"
                                                    preserveScroll
                                                >
                                                    <Button
                                                        variant="subtle"
                                                        color="red"
                                                    >
                                                        Remove
                                                    </Button>
                                                </Link>
                                            )}
                                        </Group>

                                        <Text size="xs" c="dimmed">
                                            JPG, PNG or WebP. Maximum size: 200
                                            KB.
                                        </Text>

                                        {errors.avatar && (
                                            <Text size="sm" c="red">
                                                {errors.avatar}
                                            </Text>
                                        )}
                                    </Stack>
                                </Group>
                            </Stack>

                            <Divider />

                            <AppTextInput
                                label="Name"
                                name="name"
                                defaultValue={auth.user.name}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                                error={errors.name}
                            />

                            <AppTextInput
                                label="Email address"
                                type="email"
                                name="email"
                                defaultValue={auth.user.email}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                                error={errors.email}
                            />

                            <AppTextInput
                                label="Phone number"
                                name="phone"
                                defaultValue={auth.user.phone ?? ''}
                                autoComplete="tel"
                                placeholder="Phone number"
                                error={errors.phone}
                            />

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <Stack gap="sm">
                                        <Text size="sm" c="dimmed">
                                            Your email address is unverified.
                                        </Text>

                                        <Link href={send()}>
                                            <AppButton
                                                variant="subtle"
                                                size="compact-sm"
                                                justify="flex-start"
                                                px={0}
                                            >
                                                Re-send verification email
                                            </AppButton>
                                        </Link>

                                        {status ===
                                            'verification-link-sent' && (
                                            <Text size="sm" fw={500} c="green">
                                                A new verification link has been
                                                sent to your email address.
                                            </Text>
                                        )}
                                    </Stack>
                                )}

                            <Box>
                                <AppButton
                                    type="submit"
                                    loading={processing}
                                    size="md"
                                    data-test="update-profile-button"
                                >
                                    Save
                                </AppButton>
                            </Box>
                        </Stack>
                    )}
                </Form>
            </Stack>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
