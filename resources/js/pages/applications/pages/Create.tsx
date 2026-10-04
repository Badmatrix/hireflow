import { Link, useForm } from '@inertiajs/react';
import {
    Card,
    Group,
    Paper,
    Select,
    Stack,
    Text,
    Textarea,
    Title,
} from '@mantine/core';
import { FileText } from 'lucide-react';
import type { FormEvent } from 'react';

import type { Job } from '@/pages/jobs/types/job';
import type { Resume } from '@/pages/resumes/types/resume';
import AppBack from '@/shared/components/ui/AppBack';
import AppButton from '@/shared/components/ui/AppButton';

type ApplicationFormData = {
    resume_id: string;
    cover_letter: string;
};

type CreateApplicationProps = {
    job: Job;
    resumes: Resume[];
};

export default function Create({ job, resumes }: CreateApplicationProps) {
    const defaultResume = resumes.find((resume) => resume.is_default);

    const form = useForm<ApplicationFormData>({
        resume_id: defaultResume ? String(defaultResume.id) : '',
        cover_letter: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(`/jobs/browse/${job.slug}/apply`);
    };

    return (
        <Stack gap="xl">
            {/* Back */}
            <AppBack href={`/jobs/browse/${job.slug}`} to="jobs" />

            {/* Header */}
            <Stack gap={4}>
                <Title order={2}>Apply for {job.title}</Title>

                <Text c="dimmed">
                    Submit your application to {job.company.name}.
                </Text>
            </Stack>

            {/* Job summary */}
            <Paper withBorder p="lg" radius="lg">
                <Stack gap="xs">
                    <Text fw={600}>{job.title}</Text>

                    <Text size="sm" c="dimmed">
                        {job.company.name}
                    </Text>

                    {job.location && (
                        <Text size="sm" c="dimmed">
                            {job.location}
                        </Text>
                    )}
                </Stack>
            </Paper>

            {/* No resumes */}
            {resumes.length === 0 ? (
                <Card withBorder radius="lg" padding="xl">
                    <Stack align="center" gap="sm">
                        <FileText size={32} />

                        <Title order={4}>
                            You need a resume before applying
                        </Title>

                        <Text size="sm" c="dimmed" ta="center" maw={500}>
                            Upload a resume first. You can then return here and
                            use it for your application.
                        </Text>
                        <Link href="/resumes/create">
                            <AppButton>Upload Resume</AppButton>
                        </Link>
                    </Stack>
                </Card>
            ) : (
                <Card withBorder radius="lg" padding="xl" maw={800}>
                    <form onSubmit={submit}>
                        <Stack gap="lg">
                            {/* Resume */}
                            <Select
                                label="Resume"
                                description="Choose the resume you want to submit with this application."
                                placeholder="Select a resume"
                                searchable
                                data={resumes.map((resume) => ({
                                    value: String(resume.id),
                                    label: resume.is_default
                                        ? `${resume.title} (Default)`
                                        : resume.title,
                                }))}
                                value={form.data.resume_id}
                                onChange={(value) =>
                                    form.setData('resume_id', value ?? '')
                                }
                                error={form.errors.resume_id}
                                required
                            />

                            {/* Cover letter */}
                            <Textarea
                                label="Cover Letter"
                                description="Tell the employer why you are a good fit for this position."
                                placeholder="Write your cover letter..."
                                minRows={10}
                                autosize
                                value={form.data.cover_letter}
                                onChange={(event) =>
                                    form.setData(
                                        'cover_letter',
                                        event.currentTarget.value,
                                    )
                                }
                                error={form.errors.cover_letter}
                            />

                            {/* Actions */}
                            <Group justify="flex-end" mt="md">
                                <Link href={`/jobs/browse/${job.slug}`}>
                                    <AppButton variant="default">
                                        Cancel
                                    </AppButton>
                                </Link>

                                <AppButton
                                    type="submit"
                                    loading={form.processing}
                                    disabled={!form.data.resume_id}
                                >
                                    Submit Application
                                </AppButton>
                            </Group>
                        </Stack>
                    </form>
                </Card>
            )}
        </Stack>
    );
}
