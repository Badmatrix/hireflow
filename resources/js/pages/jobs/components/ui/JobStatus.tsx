import { Badge } from '@mantine/core';
import type { Job } from '../../types/job';

type JobStatusProps = {
    status: Job['status'];
};

const statusConfig = {
    draft: {
        label: 'Draft',
        color: 'yellow',
    },
    published: {
        label: 'Published',
        color: 'green',
    },
    closed: {
        label: 'Closed',
        color: 'red',
    },
} as const;

export function JobStatus({ status }: JobStatusProps) {
    const current = statusConfig[status];

    if (!current) {
        return (
            <Badge color="gray" variant="light" size="sm">
                Unknown
            </Badge>
        );
    }

    return (
        <Badge color={current.color} variant="light" size="sm">
            {current.label}
        </Badge>
    );
}
