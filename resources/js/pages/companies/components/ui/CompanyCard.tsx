import { Link } from '@inertiajs/react';
import { Badge, Box, Card, Group, Stack, Text } from '@mantine/core';
import { BriefcaseBusiness, Building2Icon, MapPin, ShieldCheck } from 'lucide-react';
import AppButton from '@/shared/components/ui/AppButton';
import type { Company } from '../../types/company';

type CompanyCardProps = {
    company: Company;
};

export default function CompanyCard({ company }: CompanyCardProps) {
    const jobsCount = company.jobs_count ?? 0;

    return (
        <Card
            withBorder
            radius="lg"
            padding="lg"
            h="100%"
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <Stack gap="md" style={{ flexGrow: 1 }}>
                <Group justify="space-between" align="flex-start">
                    {/* <ThemeIcon size={52} radius="md" variant="light"> */}
                        <Building2Icon size={24} />
                    {/* </ThemeIcon> */}

                    {company.is_verified && (
                        <Badge
                            color="green"
                            variant="light"
                            leftSection={<ShieldCheck size={12} />}
                        >
                            Verified
                        </Badge>
                    )}
                </Group>

                <Box>
                    <Text fw={700} size="lg" lineClamp={1}>
                        {company.name}
                    </Text>

                    <Text size="sm" c="dimmed" mt={4} lineClamp={2}>
                        {company.company_type}
                    </Text>
                </Box>

                <Stack gap="xs">
                    <Group gap="xs">
                        <MapPin size={16} />
                        <Text size="sm" lineClamp={1}>
                            {company?.location || 'Location not specified'}
                        </Text>
                    </Group>

                    <Group gap="xs">
                        <BriefcaseBusiness size={16} />
                        <Text size="sm">
                            {jobsCount} open {jobsCount === 1 ? 'job' : 'jobs'}
                        </Text>
                    </Group>
                </Stack>

                <div style={{ flexGrow: 1 }} />

                <Link
                    href={`/companies/browse/${company.slug}`}
                    style={{ display: 'block' }}
                >
                    <AppButton variant="light" fullWidth>
                        View Company
                    </AppButton>
                </Link>
            </Stack>
        </Card>
    );
}
