import { Link, router } from '@inertiajs/react';
import { Badge, Box, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import AppPagination from '@/shared/components/ui/app-pagination';
import AppButton from '@/shared/components/ui/AppButton';
import AppSelect from '@/shared/components/ui/AppSelect';
import AppTable from '@/shared/components/ui/AppTable';
import type { AppTableColumn } from '@/shared/components/ui/AppTable';
import AppTextInput from '@/shared/components/ui/AppTextInput';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import CompanyAction from '../components/ui/CompanyAction';
import type { Company } from '../types/company';

export type CompanyFilters = {
    search: string;
    status?: 'verified' | 'pending' | '';
    sort?: string;
    direction?: 'asc' | 'desc';
};

type CompaniesIndexProps = {
    companies: PaginatedResponse<Company>;
    filters: CompanyFilters;
    isAdmin: boolean;
    canCreate: boolean;
};

export default function CompanyIndex({
    companies,
    filters,
    isAdmin,
    canCreate,
}: CompaniesIndexProps) {
    const [search, setSearch] = useState(filters.search);
    const [debouncedSearch] = useDebouncedValue(search, 500);
    const canManage=canCreate || isAdmin

    useEffect(() => {
        if (debouncedSearch === filters.search) {
            return;
        }

        router.get(
            '/companies',
            {
                search: debouncedSearch || undefined,
                sort: filters.sort || undefined,
                direction: filters.direction || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, filters.search, filters.sort, filters.direction]);

    const columns: AppTableColumn<Company>[] = [
        {
            key: 'company',
            label: 'Company',
            sortable: true,
            sortKey: 'name',

            render: (company) => (
                <Stack gap={2}>
                    <Text size="sm" fw={600}>
                        {company.name}
                    </Text>

                    <Text size="xs" c="dimmed">
                        {company.company_type}
                    </Text>
                </Stack>
            ),
        },

        {
            key: 'location',
            label: 'Location',
            sortable: true,
            sortKey: 'location',

            render: (company) => <Text size="sm">{company.location}</Text>,
        },

        {
            key: 'jobs',
            label: 'Jobs',
            sortable: true,
            sortKey: 'jobs_count',

            render: (company) => <Text size="sm">{company.jobs_count}</Text>,
        },

        {
            key: 'status',
            label: 'Status',
            sortable: true,
            sortKey: 'is_verified',

            render: (company) => (
                <Badge
                    color={company.is_verified ? 'green' : 'yellow'}
                    variant="light"
                >
                    {company.is_verified ? 'Verified' : 'Pending'}
                </Badge>
            ),
        },

        ...(canManage
            ? [
                  {
                      key: 'actions',
                      label: 'Actions',
                      align: 'right' as const,

                      render: (company: Company) => (
                          <Group justify="flex-end">
                              <CompanyAction company={company} />
                          </Group>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <Stack gap="xl">
            {/* Page header */}
            <Group justify="space-between" align="flex-start" gap="md">
                <Box>
                    <Title order={2}>
                        {isAdmin ? 'Companies' : 'My Companies'}
                    </Title>

                    <Text size="sm" c="dimmed" mt={4}>
                        {isAdmin
                            ? 'Manage companies registered on HireFlow.'
                            : 'Manage your registered companies.'}
                    </Text>
                </Box>

                {canCreate && (
                    <Link
                        href="/companies/create"
                        style={{
                            textDecoration: 'none',
                        }}
                    >
                        <AppButton leftSection={<Plus size={16} />}>
                            Add Company
                        </AppButton>
                    </Link>
                )}
            </Group>

            {/* Search */}
            <Paper withBorder p="md">
                <Group align="flex-end">
                    <AppTextInput
                        flex={1}
                        value={search}
                        onChange={(event) =>
                            setSearch(event.currentTarget.value)
                        }
                        placeholder="Search companies..."
                        leftSection={<Search size={16} />}
                    />

                    <AppSelect
                        w={180}
                        label="Status"
                        placeholder="Filter by status"
                        clearable
                        data={[
                            {
                                value: 'verified',
                                label: 'Verified',
                            },
                            {
                                value: 'pending',
                                label: 'Pending',
                            },
                        ]}
                        value={filters.status || null}
                        onChange={(value) => {
                            router.get(
                                '/companies',
                                {
                                    search: filters.search || undefined,
                                    status: value || undefined,
                                    sort: filters.sort || undefined,
                                    direction: filters.direction || undefined,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                },
                            );
                        }}
                    />
                </Group>
            </Paper>

            {/* Company table */}
            <Paper
                withBorder
                style={{
                    overflow: 'hidden',
                }}
            >
                <AppTable
                    data={companies.data}
                    columns={columns}
                    getRowKey={(company) => company.id}
                    sort={filters.sort}
                    direction={filters.direction}
                    queryParams={{
                        search: filters.search || undefined,
                    }}
                    emptyTitle="No companies found"
                    emptyMessage={
                        filters.search
                            ? 'Try a different search.'
                            : 'No companies have been created yet.'
                    }
                />
            </Paper>

            {/* Pagination */}
            <AppPagination data={companies} />
        </Stack>
    );
}
