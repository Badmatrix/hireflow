import { Link } from '@inertiajs/react';
import {
    Anchor,
    Badge,
    Box,
    Divider,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    ArrowLeft,
    Building2,
    Edit,
    Globe,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react';

import AppButton from '@/shared/components/ui/AppButton';
import type { Company } from '../types/company';

type CompanyShowProps = {
    company: Company;
};

export default function CompanyShow({
    company,
}: CompanyShowProps) {
    return (
        <Stack gap="xl">
            {/* Header */}
            <Group justify="space-between" align="flex-start">
                <Group gap="md">
                    <Link
                        href="/companies"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div>
                        <Title order={2}>
                            {company.name}
                        </Title>

                        <Text
                            size="sm"
                            c="dimmed"
                            mt={4}
                        >
                            Company details
                        </Text>
                    </div>
                </Group>

                <Link
                    href={`/companies/${company.id}/edit`}
                    style={{
                        textDecoration: 'none',
                    }}
                >
                    <AppButton
                        leftSection={<Edit size={16} />}
                    >
                        Edit Company
                    </AppButton>
                </Link>
            </Group>

            {/* Company overview */}
            <Paper
                withBorder
                p="xl"
                radius="md"
            >
                <Stack gap="lg">
                    <Group
                        justify="space-between"
                        align="flex-start"
                    >
                        <Group gap="md">
                            <Paper
                                withBorder
                                p="md"
                                radius="md"
                            >
                                <Building2 size={32} />
                            </Paper>

                            <div>
                                <Title order={3}>
                                    {company.name}
                                </Title>

                                {company.company_type && (
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        mt={4}
                                    >
                                        {company.company_type}
                                    </Text>
                                )}
                            </div>
                        </Group>

                        <Badge
                            color={
                                company.is_verified
                                    ? 'green'
                                    : 'yellow'
                            }
                            variant="light"
                        >
                            {company.is_verified
                                ? 'Verified'
                                : 'Pending'}
                        </Badge>
                    </Group>

                    {company.slogan && (
                        <>
                            <Divider />

                            <Text size="md">
                                {company.slogan}
                            </Text>
                        </>
                    )}
                </Stack>
            </Paper>

            {/* Company information */}
            <Paper
                withBorder
                p="xl"
                radius="md"
            >
                <Stack gap="lg">
                    <Title order={3}>
                        Company Information
                    </Title>

                    <SimpleGrid
                        cols={{
                            base: 1,
                            sm: 2,
                        }}
                        spacing="lg"
                    >
                        <InfoItem
                            icon={<MapPin size={18} />}
                            label="Location"
                            value={company.location}
                        />

                        <InfoItem
                            icon={<Building2 size={18} />}
                            label="Company Type"
                            value={company.company_type}
                        />

                        <InfoItem
                            icon={<Mail size={18} />}
                            label="Email"
                            value={company.email}
                            href={
                                company.email
                                    ? `mailto:${company.email}`
                                    : undefined
                            }
                        />

                        <InfoItem
                            icon={<Phone size={18} />}
                            label="Phone"
                            value={company.phone}
                            href={
                                company.phone
                                    ? `tel:${company.phone}`
                                    : undefined
                            }
                        />

                        <InfoItem
                            icon={<Globe size={18} />}
                            label="Website"
                            value={company.website}
                            href={company.website ?? undefined}
                        />
                    </SimpleGrid>
                </Stack>
            </Paper>

            {/* Description */}
            {company.description && (
                <Paper
                    withBorder
                    p="xl"
                    radius="md"
                >
                    <Stack gap="sm">
                        <Title order={3}>
                            Description
                        </Title>

                        <Text
                            size="sm"
                            c="dimmed"
                            lh={1.7}
                        >
                            {company.description}
                        </Text>
                    </Stack>
                </Paper>
            )}
        </Stack>
    );
}

type InfoItemProps = {
    icon: React.ReactNode;
    label: string;
    value: string | null;
    href?: string;
};

function InfoItem({
    icon,
    label,
    value,
    href,
}: InfoItemProps) {
    return (
        <Group
            gap="sm"
            align="flex-start"
            wrap="nowrap"
        >
            <Box
                mt={2}
                c="dimmed"
            >
                {icon}
            </Box>

            <div>
                <Text
                    size="xs"
                    c="dimmed"
                    fw={500}
                >
                    {label}
                </Text>

                {href && value ? (
                    <Anchor
                        href={href}
                        target={
                            href.startsWith('http')
                                ? '_blank'
                                : undefined
                        }
                        rel={
                            href.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                        }
                        size="sm"
                    >
                        {value}
                    </Anchor>
                ) : (
                    <Text size="sm">
                        {value || 'Not provided'}
                    </Text>
                )}
            </div>
        </Group>
    );
}