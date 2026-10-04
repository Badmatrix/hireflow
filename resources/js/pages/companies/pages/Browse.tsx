import { Link, router } from '@inertiajs/react';
import {
    Badge,
    Card,
    Grid,
    Group,
    Pagination,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Building2, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { BrowseCompaniesProps } from '../types/company';

export default function CompanyBrowse({
    companies,
    filters,
}: BrowseCompaniesProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const [debouncedSearch] = useDebouncedValue(search, 500);

    useEffect(() => {
        if (debouncedSearch === filters.search) {
            return;
        }

        router.get(
            '/companies/browse',
            {
                search: debouncedSearch || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, filters.search]);

    return (
        <Stack gap="xl">
            {/* Header */}
            <Stack gap={4}>
                <Title order={2}>Explore Companies</Title>

                <Text c="dimmed">
                    Discover verified companies hiring on HireFlow.
                </Text>
            </Stack>

            {/* Search */}
            <Paper withBorder radius="lg" p="md">
                <TextInput
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Search companies..."
                    leftSection={<Search size={16} />}
                />
            </Paper>

            {/* Results */}
            {companies.data.length > 0 ? (
                <Grid>
                    {companies.data.map((company) => (
                        <Grid.Col
                            key={company.id}
                            span={{
                                base: 12,
                                sm: 6,
                                lg: 4,
                            }}
                        >
                            <Card
                                component={Link}
                                href={`/companies/browse/${company.slug}`}
                                withBorder
                                radius="lg"
                                padding="lg"
                                h="100%"
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                <Stack gap="lg" h="100%">
                                    <Group
                                        justify="space-between"
                                        align="flex-start"
                                    >
                                        <Group gap="sm" wrap="nowrap">
                                            <Paper
                                                w={48}
                                                h={48}
                                                radius="md"
                                                withBorder
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Building2 size={22} />
                                            </Paper>

                                            <Stack gap={2}>
                                                <Text fw={600} lineClamp={1}>
                                                    {company.name}
                                                </Text>

                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    tt="capitalize"
                                                >
                                                    {company.company_type}
                                                </Text>
                                            </Stack>
                                        </Group>

                                        <Badge
                                            color="green"
                                            variant="light"
                                            size="sm"
                                        >
                                            Verified
                                        </Badge>
                                    </Group>

                                    {company.slogan && (
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            lineClamp={2}
                                        >
                                            {company.slogan}
                                        </Text>
                                    )}

                                    <Group gap="xs" c="dimmed">
                                        <MapPin size={15} />

                                        <Text size="sm" lineClamp={1}>
                                            {company.location}
                                        </Text>
                                    </Group>

                                    <Group justify="space-between" mt="auto">
                                        <Text size="sm" fw={600}>
                                            {company.published_jobs_count ?? 0}{' '}
                                            {company.published_jobs_count === 1
                                                ? 'open job'
                                                : 'open jobs'}
                                        </Text>

                                        <Text size="sm" c="blue">
                                            View company →
                                        </Text>
                                    </Group>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            ) : (
                <Paper withBorder radius="lg" p="xl">
                    <Stack align="center" gap="xs">
                        <Building2 size={32} />

                        <Text fw={600}>No companies found</Text>

                        <Text size="sm" c="dimmed">
                            {filters.search
                                ? 'Try searching for another company.'
                                : 'There are no verified companies yet.'}
                        </Text>
                    </Stack>
                </Paper>
            )}

            {/* Pagination */}
            {companies.last_page > 1 && (
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        Showing {companies.from ?? 0}–{companies.to ?? 0} of{' '}
                        {companies.total}
                    </Text>

                    <Pagination
                        value={companies.current_page}
                        total={companies.last_page}
                        onChange={(page) => {
                            router.get(
                                '/companies/browse',
                                {
                                    search: filters.search || undefined,
                                    page,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                },
                            );
                        }}
                    />
                </Group>
            )}
        </Stack>
    );
}
