import { router } from '@inertiajs/react';
import { Group, Stack, Table, Text, UnstyledButton } from '@mantine/core';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export type AppTableColumn<T> = {
    key: string;
    label: string;

    render: (item: T) => ReactNode;

    sortable?: boolean;
    sortKey?: string;

    align?: 'left' | 'center' | 'right';
};

type AppTableProps<T> = {
    data: T[];
    columns: AppTableColumn<T>[];
    getRowKey: (item: T) => string | number;

    sort?: string | null;
    direction?: SortDirection;

    queryParams?: Record<string, string | number | boolean | null | undefined>;

    emptyTitle?: string;
    emptyMessage?: string;

    minWidth?: number;
};

export default function AppTable<T>({
    data,
    columns,
    getRowKey,
    sort = null,
    direction = 'asc',
    queryParams = {},
    emptyTitle = 'No records found',
    emptyMessage = 'There are no records to display.',
    minWidth = 800,
}: AppTableProps<T>) {
    const handleSort = (column: AppTableColumn<T>) => {
        if (!column.sortable || !column.sortKey) {
            return;
        }

        let nextDirection: SortDirection = 'asc';

        if (sort === column.sortKey && direction === 'asc') {
            nextDirection = 'desc';
        }

        router.get(
            window.location.pathname,
            {
                ...queryParams,
                sort: column.sortKey,
                direction: nextDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const getSortIcon = (column: AppTableColumn<T>) => {
        if (!column.sortable) {
            return null;
        }

        if (sort !== column.sortKey) {
            return <ChevronsUpDown size={15} strokeWidth={1.8} />;
        }

        return direction === 'asc' ? (
            <ChevronUp size={15} strokeWidth={1.8} />
        ) : (
            <ChevronDown size={15} strokeWidth={1.8} />
        );
    };

    const getJustify = (align?: AppTableColumn<T>['align']) => {
        switch (align) {
            case 'right':
                return 'flex-end';

            case 'center':
                return 'center';

            default:
                return 'flex-start';
        }
    };

    return (
        <Table.ScrollContainer minWidth={minWidth}>
            <Table
                verticalSpacing="md"
                horizontalSpacing="lg"
                highlightOnHover
                withRowBorders
            >
                {/* Header */}
                <Table.Thead>
                    <Table.Tr>
                        {columns.map((column) => (
                            <Table.Th key={column.key} ta={column.align}>
                                {column.sortable ? (
                                    <UnstyledButton
                                        onClick={() => handleSort(column)}
                                        w="100%"
                                        py={4}
                                    >
                                        <Group
                                            gap={5}
                                            justify={getJustify(column.align)}
                                            wrap="nowrap"
                                        >
                                            <Text
                                                size="xs"
                                                fw={600}
                                                c="dimmed"
                                                tt="uppercase"
                                            >
                                                {column.label}
                                            </Text>

                                            {getSortIcon(column)}
                                        </Group>
                                    </UnstyledButton>
                                ) : (
                                    <Text
                                        size="xs"
                                        fw={600}
                                        c="dimmed"
                                        tt="uppercase"
                                    >
                                        {column.label}
                                    </Text>
                                )}
                            </Table.Th>
                        ))}
                    </Table.Tr>
                </Table.Thead>

                {/* Body */}
                <Table.Tbody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <Table.Tr key={getRowKey(item)}>
                                {columns.map((column) => (
                                    <Table.Td
                                        key={column.key}
                                        ta={column.align}
                                    >
                                        {column.render(item)}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        ))
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={columns.length}>
                                <Stack align="center" gap="xs" py="xl">
                                    <Text fw={600}>{emptyTitle}</Text>

                                    <Text size="sm" c="dimmed" ta="center">
                                        {emptyMessage}
                                    </Text>
                                </Stack>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
