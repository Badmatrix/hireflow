import { router } from '@inertiajs/react';
import { Group, Pagination, Text } from '@mantine/core';

import type { PaginatedResponse } from '@/shared/types/pagination';

type AppPaginationProps<T> = {
    data: PaginatedResponse<T>;
};

export default function AppPagination<T>({ data }: AppPaginationProps<T>) {
    const { last_page, current_page, from, to, total } = data;

    if (last_page <= 1) {
        return null;
    }

    const handlePageChange = (page: number) => {
        const params = Object.fromEntries(
            new URLSearchParams(window.location.search),
        );

        router.get(
            window.location.pathname,
            {
                ...params,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <Group justify="space-between" align="center" gap="md">
            <Text size="sm" c="dimmed">
                Showing {from ?? 0}–{to ?? 0} of {total}
            </Text>

            <Pagination
                value={current_page}
                total={last_page}
                onChange={handlePageChange}
                color='hireflowBlue.9'
            />
        </Group>
    );
}
