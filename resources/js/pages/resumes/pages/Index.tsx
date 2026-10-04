import { Link, router } from '@inertiajs/react';
import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Eye, FileText, Plus, Star, Trash2 } from 'lucide-react';

import { useState } from 'react';
import ConfirmationModal from '@/shared/components/feedback/AppModal';
import AppButton from '@/shared/components/ui/AppButton';

type Resume = {
    id: number;
    title: string;
    original_name: string;
    mime_type: string;
    file_size: number;
    is_default: boolean;
    created_at: string;
};

type ResumeIndexProps = {
    resumes: Resume[];
};

export default function Index({ resumes }: ResumeIndexProps) {
    const [deleteResume, setDeleteResume] = useState<Resume | null>(null);
    const [processing, setProcessing] = useState(false);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleDelete = () => {
        if (!deleteResume) {
            return;
        }

        setProcessing(true);

        router.delete(`/resumes/${deleteResume.id}`, {
            preserveScroll: true,

            onFinish: () => {
                setProcessing(false);
                setDeleteResume(null);
            },
        });
    };

    const setDefault = (resume: Resume) => {
        router.post(
            `/resumes/${resume.id}/default`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <Stack gap="xl">
            <Group justify="space-between">
                <Stack gap={4}>
                    <Title order={2}>My Resumes</Title>

                    <Text c="dimmed">
                        Manage the resumes you use when applying for jobs.
                    </Text>
                </Stack>
                <Link href="/resumes/create">
                    <AppButton leftSection={<Plus size={16} />}>
                        Upload Resume
                    </AppButton>
                </Link>
            </Group>

            {resumes.length === 0 ? (
                <Card withBorder radius="lg" padding="xl">
                    <Stack align="center" gap="sm">
                        <FileText size={36} />

                        <Text fw={600}>No resumes yet</Text>

                        <Text size="sm" c="dimmed">
                            Upload a resume before applying for jobs.
                        </Text>
                        <Link href="/resumes/create">
                            <AppButton leftSection={<Plus size={16} />} mt="sm">
                                Upload Resume
                            </AppButton>
                        </Link>
                    </Stack>
                </Card>
            ) : (
                <Stack gap="md">
                    {resumes.map((resume) => (
                        <Card
                            key={resume.id}
                            withBorder
                            radius="lg"
                            padding="lg"
                        >
                            <Group justify="space-between">
                                <Group>
                                    <FileText size={28} />

                                    <Stack gap={2}>
                                        <Group gap="xs">
                                            <Text fw={600}>{resume.title}</Text>

                                            {resume.is_default && (
                                                <Badge
                                                    color="green"
                                                    variant="light"
                                                >
                                                    Default
                                                </Badge>
                                            )}
                                        </Group>

                                        <Text size="sm" c="dimmed">
                                            {resume.original_name}
                                        </Text>

                                        <Text size="xs" c="dimmed">
                                            {formatFileSize(resume.file_size)}
                                        </Text>
                                    </Stack>
                                </Group>

                                <Group gap="xs">
                                    <AppButton
                                        variant="subtle"
                                        leftSection={<Eye size={16} />}
                                        onClick={() =>
                                            window.open(
                                                `/resumes/${resume.id}/view`,
                                                '_blank',
                                            )
                                        }
                                    >
                                        View
                                    </AppButton>

                                    {!resume.is_default && (
                                        <AppButton
                                            variant="subtle"
                                            leftSection={<Star size={16} />}
                                            onClick={() => setDefault(resume)}
                                        >
                                            Set Default
                                        </AppButton>
                                    )}

                                    <AppButton
                                        variant="subtle"
                                        color="red"
                                        leftSection={<Trash2 size={16} />}
                                        onClick={() => setDeleteResume(resume)}
                                    >
                                        Delete
                                    </AppButton>
                                </Group>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}

            <ConfirmationModal
                opened={deleteResume !== null}
                onClose={() => {
                    if (!processing) {
                        setDeleteResume(null);
                    }
                }}
                onConfirm={handleDelete}
                loading={processing}
                title="Delete resume"
                confirmLabel="Delete"
                confirmColor="red"
                description={
                    <>
                        Are you sure you want to delete{' '}
                        <Text component="span" fw={700}>
                            {deleteResume?.title}
                        </Text>
                        ? This action cannot be undone.
                    </>
                }
            />
        </Stack>
    );
}
