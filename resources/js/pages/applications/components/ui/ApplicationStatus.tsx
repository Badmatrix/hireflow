import { Badge } from '@mantine/core';

import type { ApplicationStatus } from '../../types/application';

type Props = {
    status: ApplicationStatus;
};

const statusConfig: Record<
    ApplicationStatus,
    {
        label: string;
        color: string;
    }
> = {
    pending: {
        label: 'Pending',
        color: 'yellow',
    },

    reviewing: {
        label: 'Reviewing',
        color: 'blue',
    },

    shortlisted: {
        label: 'Shortlisted',
        color: 'green',
    },

    rejected: {
        label: 'Rejected',
        color: 'red',
    },

    hired: {
        label: 'Hired',
        color: 'teal',
    },

    withdrawn: {
        label: 'Withdrawn',
        color: 'gray',
    },
};
export function ApplicationStatus({ status }: Props) {
    const config = statusConfig[status];

    return (
        <Badge variant="light" color={config.color}>
            {config.label}
        </Badge>
    );
}
