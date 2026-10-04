import { Link } from '@inertiajs/react';
import type { InertiaFormProps } from '@inertiajs/react';
import { Card, Checkbox, FileInput, Group, Stack, Text, Title } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import type { FormEventHandler } from 'react';

import AppButton from '@/shared/components/ui/AppButton';
import AppTextInput from '@/shared/components/ui/AppTextInput';

import type { ResumeFormData } from '../types/resume';

type ResumeFormProps = {
    form: InertiaFormProps<ResumeFormData>;
    editing?: boolean;
    currentFileName?: string;
    onSubmit: FormEventHandler<HTMLFormElement>;
};

export default function ResumeForm({
    form,
    editing = false,
    currentFileName,
    onSubmit,
}: ResumeFormProps) {
    return (
        <Stack gap="xl">
            <Link
                href="/resumes"
                style={{
                    textDecoration: 'none',
                }}
            >
                <AppButton
                    variant="subtle"
                    leftSection={<ArrowLeft size={16} />}
                    w="fit-content"
                >
                    Back to Resumes
                </AppButton>
            </Link>

            <Stack gap={4}>
                <Title order={2}>
                    {editing ? 'Edit Resume' : 'Upload Resume'}
                </Title>

                <Text c="dimmed">
                    {editing
                        ? 'Update your resume information or replace the file.'
                        : 'Upload a resume you can use when applying for jobs.'}
                </Text>
            </Stack>

            <Card withBorder radius="lg" padding="xl" maw={800}>
                <form onSubmit={onSubmit}>
                    <Stack gap="lg">
                        <AppTextInput
                            label="Resume Title"
                            placeholder="e.g. Frontend Developer Resume"
                            value={form.data.title}
                            onChange={(event) =>
                                form.setData('title', event.currentTarget.value)
                            }
                            error={form.errors.title}
                            required
                        />

                        <div>
                            

                            {currentFileName && (
                                <Text size="sm" c="dimmed" mb="xs">
                                    Current file: {currentFileName}
                                </Text>
                            )}

                            <FileInput
                                label="Resume"
                                placeholder="Select your resume"
                                accept="application/pdf,.doc,.docx"
                                value={form.data.file}
                                onChange={(file) => form.setData('file', file)}
                                error={form.errors.file}
                                required
                            />

                           

                            <Text size="xs" c="dimmed" mt={5}>
                                Accepted formats: PDF, DOC, DOCX. Maximum size:
                                5MB.
                            </Text>
                        </div>

                        <Checkbox
                            label="Set as default resume"
                            checked={form.data.is_default}
                            onChange={(event) =>
                                form.setData(
                                    'is_default',
                                    event.currentTarget.checked,
                                )
                            }
                            error={form.errors.is_default}
                        />

                        <Group justify="flex-end" mt="md">
                            <Link href="/resumes">
                                <AppButton variant="default">Cancel</AppButton>
                            </Link>

                            <AppButton type="submit" loading={form.processing}>
                                {editing ? 'Save Changes' : 'Upload Resume'}
                            </AppButton>
                        </Group>
                    </Stack>
                </form>
            </Card>
        </Stack>
    );
}
