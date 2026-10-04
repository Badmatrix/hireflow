import type { InertiaFormProps } from '@inertiajs/react';
import { Box, Grid, Stack, Text } from '@mantine/core';
import type { FormEventHandler } from 'react';

import AppForm from '@/shared/components/AppForm';
import AppButton from '@/shared/components/ui/AppButton';
import AppTextarea from '@/shared/components/ui/AppTextarea';
import AppTextInput from '@/shared/components/ui/AppTextInput';

import type { CompanyFormData } from '../types/company';

type CompanyFormProps = {
    form: InertiaFormProps<CompanyFormData>;
    onSubmit: FormEventHandler<HTMLFormElement>;
    submitLabel: string;
};

export default function CompanyForm({
    form,
    onSubmit,
    submitLabel,
}: CompanyFormProps) {
    return (
        <AppForm
            title="Company Information"
            description="Provide the basic information about the company."
            onSubmit={onSubmit}
            actions={
                <AppButton type="submit" loading={form.processing}>
                    {submitLabel}
                </AppButton>
            }
        >
            <Stack gap="xl">
                {/* Basic information */}
                <Stack gap="md">
                    <Text fw={600}>Basic Information</Text>

                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <AppTextInput
                                label="Company Name"
                                placeholder="e.g. Acme Technologies"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.currentTarget.value)
                                }
                                error={form.errors.name}
                                required
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <AppTextInput
                                label="Company Type"
                                placeholder="e.g. Technology, Finance"
                                value={form.data.company_type}
                                onChange={(e) =>
                                    form.setData(
                                        'company_type',
                                        e.currentTarget.value,
                                    )
                                }
                                error={form.errors.company_type}
                                required
                            />
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <AppTextInput
                                label="Slogan"
                                placeholder="e.g. Building the future together"
                                value={form.data.slogan}
                                onChange={(e) =>
                                    form.setData(
                                        'slogan',
                                        e.currentTarget.value,
                                    )
                                }
                                error={form.errors.slogan}
                            />
                        </Grid.Col>
                    </Grid>
                </Stack>

                {/* Contact information */}
                <Stack gap="md">
                    <Text fw={600}>Contact Information</Text>

                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <AppTextInput
                                label="Email"
                                type="email"
                                placeholder="company@example.com"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.currentTarget.value)
                                }
                                error={form.errors.email}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6 }}>
                            <AppTextInput
                                label="Phone"
                                placeholder="+234 800 000 0000"
                                value={form.data.phone}
                                onChange={(e) =>
                                    form.setData('phone', e.currentTarget.value)
                                }
                                error={form.errors.phone}
                            />
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <AppTextInput
                                label="Website"
                                placeholder="https://example.com"
                                value={form.data.website}
                                onChange={(e) =>
                                    form.setData(
                                        'website',
                                        e.currentTarget.value,
                                    )
                                }
                                error={form.errors.website}
                            />
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <AppTextInput
                                label="Location"
                                placeholder="e.g. Lagos, Nigeria"
                                value={form.data.location}
                                onChange={(e) =>
                                    form.setData(
                                        'location',
                                        e.currentTarget.value,
                                    )
                                }
                                error={form.errors.location}
                                required
                            />
                        </Grid.Col>
                    </Grid>
                </Stack>

                {/* Description */}
                <Stack gap="md">
                    <Box>
                        <Text fw={600}>About the Company</Text>
                        <Text size="sm" c="dimmed" mt={2}>
                            Give candidates a brief overview of the company.
                        </Text>
                    </Box>

                    <AppTextarea
                        label="Description"
                        placeholder="Tell candidates about the company's mission, culture, products and services..."
                        value={form.data.description}
                        minRows={6}
                        autosize
                        required
                        onChange={(e) =>
                            form.setData('description', e.currentTarget.value)
                        }
                        error={form.errors.description}
                    />
                </Stack>
            </Stack>
        </AppForm>
    );
}
