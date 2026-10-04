import { Head, router, usePage } from '@inertiajs/react';
import {
    ActionIcon,
    Avatar,
    Badge,
    Group,
    Menu,
    Paper,
    Stack,
    Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
    MoreVertical,
    Search,
    UserCheck,
    UserMinus,
    UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import Heading from '@/components/heading';
import { useInitials } from '@/hooks/use-initials';
import ConfirmationModal from '@/shared/components/feedback/AppModal';
import AppPagination from '@/shared/components/ui/app-pagination';
import AppSelect from '@/shared/components/ui/AppSelect';
import type {
    SortDirection,
    AppTableColumn,
} from '@/shared/components/ui/AppTable';
import AppTable from '@/shared/components/ui/AppTable';
import AppTextInput from '@/shared/components/ui/AppTextInput';
import { formatDate } from '@/shared/constant/helper';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type { Auth, User } from '@/types';

type Filters = {
    search: string;
    role: string;
    status: string;
};

type PageProps = {
    auth: Auth;
    users: PaginatedResponse<User>;
    filters: Filters;
    sort: string | null;
    direction: SortDirection;
};

const statusColors = {
    active: 'green',
    inactive: 'yellow',
    suspended: 'red',
} as const;

const confirmColors: Record<User['status'], string> = {
    active: 'green',
    inactive: 'yellow',
    suspended: 'red',
};

export default function UsersIndex() {
    const getInitials = useInitials();
    const { auth, users, filters, sort, direction } =
        usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState<string | null>(filters.role || null);
    const [status, setStatus] = useState<string | null>(filters.status || null);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<User['status'] | null>(
        null,
    );

    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [debouncedSearch] = useDebouncedValue(search, 500);

    useEffect(() => {
        if (debouncedSearch === (filters.search ?? '')) {
            return;
        }

        router.get(
            '/users',
            {
                search: debouncedSearch || undefined,
                role: role || undefined,
                status: status || undefined,
                sort: sort || undefined,
                direction: sort ? direction : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const applyFilters = (overrides: Partial<Filters> = {}) => {
        const nextSearch = overrides.search ?? search;
        const nextRole = overrides.role ?? role ?? '';
        const nextStatus = overrides.status ?? status ?? '';

        router.get(
            '/users',
            {
                search: nextSearch || undefined,
                role: nextRole || undefined,
                status: nextStatus || undefined,
                sort: sort || undefined,
                direction: sort ? direction : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const confirmStatusChange = (user: User, newStatus: User['status']) => {
        setSelectedUser(user);
        setSelectedStatus(newStatus);
    };

    const closeConfirmation = () => {
        if (updatingStatus) {
            return;
        }

        setSelectedUser(null);
        setSelectedStatus(null);
    };

    const updateStatus = () => {
        if (!selectedUser || !selectedStatus) {
            return;
        }

        setUpdatingStatus(true);

        router.patch(
            `/users/${selectedUser.id}/status`,
            {
                status: selectedStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedUser(null);
                    setSelectedStatus(null);
                },
                onFinish: () => {
                    setUpdatingStatus(false);
                },
            },
        );
    };

    const confirmationTitle =
        selectedStatus === 'suspended'
            ? 'Suspend user'
            : selectedStatus === 'inactive'
              ? 'Deactivate user'
              : 'Activate user';

    const confirmationLabel =
        selectedStatus === 'suspended'
            ? 'Suspend'
            : selectedStatus === 'inactive'
              ? 'Deactivate'
              : 'Activate';

    const columns: AppTableColumn<User>[] = [
        {
            key: 'user',
            label: 'User',
            sortable: true,
            sortKey: 'name',
            render: (user) => (
                <Group gap="sm" wrap="nowrap">
                    <Avatar
                        src={`/storage/${user.avatar}`}
                        radius="xl"
                        size={'md'}
                        color="initials"
                        // variant="light"
                        // alt={user.name}
                    >
                        {getInitials(user.name)}
                    </Avatar>
                    <Stack gap={0}>
                        <Text fw={600}>{user.name}</Text>
                        <Text size="sm" c="dimmed">
                            {user.email}
                        </Text>
                    </Stack>
                </Group>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            render: (user) => (
                <Text tt="capitalize" fz="sm">
                    {user.role.name}
                </Text>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (user) => (
                <Badge
                    color={statusColors[user.status]}
                    variant="light"
                    tt="capitalize"
                >
                    {user.status}
                </Badge>
            ),
        },
        {
            key: 'joined',
            label: 'Joined',
            sortable: true,
            sortKey: 'created_at',
            render: (user) => (
                <Text size="sm" c="dimmed">
                    {formatDate(user.created_at)}
                </Text>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            render: (user) =>
                auth.user.id === user.id ? (
                    <Text size="sm" c="dimmed">
                        Current account
                    </Text>
                ) : (
                    <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                            <ActionIcon
                                variant="subtle"
                                aria-label={`Manage ${user.name}`}
                            >
                                <MoreVertical size={18} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Change status</Menu.Label>

                            <Menu.Item
                                leftSection={<UserCheck size={16} />}
                                disabled={user.status === 'active'}
                                onClick={() =>
                                    confirmStatusChange(user, 'active')
                                }
                            >
                                Activate
                            </Menu.Item>

                            <Menu.Item
                                leftSection={<UserMinus size={16} />}
                                disabled={user.status === 'inactive'}
                                onClick={() =>
                                    confirmStatusChange(user, 'inactive')
                                }
                            >
                                Deactivate
                            </Menu.Item>

                            <Menu.Item
                                color="red"
                                leftSection={<UserX size={16} />}
                                disabled={user.status === 'suspended'}
                                onClick={() =>
                                    confirmStatusChange(user, 'suspended')
                                }
                            >
                                Suspend
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                ),
        },
    ];

    return (
        <>
            <Head title="Users" />

            <Stack gap="xl">
                <Heading
                    variant="small"
                    title="Users"
                    description="Manage user accounts and account status"
                />

                <Paper withBorder radius="lg" p="md" className="shadow-sm">
                    <Group align="flex-end">
                        <AppTextInput
                            flex={1}
                            label="Search"
                            placeholder="Search by name or email"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.currentTarget.value)
                            }
                            leftSection={<Search size={16} />}
                        />

                        <AppSelect
                            w={180}
                            label="Role"
                            placeholder="All roles"
                            clearable
                            data={[
                                { value: 'admin', label: 'Admin' },
                                { value: 'employer', label: 'Employer' },
                                { value: 'job seeker', label: 'Job seeker' },
                            ]}
                            value={role}
                            onChange={(value) => {
                                setRole(value);
                                applyFilters({ role: value ?? '' });
                            }}
                        />

                        <AppSelect
                            label="Status"
                            placeholder="All status"
                            clearable
                            data={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'suspended', label: 'Suspended' },
                            ]}
                            value={status}
                            onChange={(value) => {
                                setStatus(value);
                                applyFilters({ status: value ?? '' });
                            }}
                        />
                    </Group>
                </Paper>

                <Paper withBorder radius="lg" p={0} className="shadow-sm">
                    <AppTable
                        data={users.data}
                        columns={columns}
                        getRowKey={(user) => user.id}
                        sort={sort}
                        direction={direction}
                        queryParams={{
                            search: search || undefined,
                            role: role || undefined,
                            status: status || undefined,
                        }}
                        emptyTitle="No users found"
                        emptyMessage="Try adjusting your filters or search terms."
                        minWidth={700}
                    />
                </Paper>

                <AppPagination data={users} />

                <ConfirmationModal
                    opened={selectedUser !== null}
                    onClose={closeConfirmation}
                    onConfirm={updateStatus}
                    title={confirmationTitle}
                    description={
                        selectedUser && selectedStatus ? (
                            <>
                                Are you sure you want to{' '}
                                <Text component="span" fw={600}>
                                    {selectedStatus.charAt(0).toUpperCase() +
                                        selectedStatus.slice(1)}
                                </Text>{' '}
                                the account of{' '}
                                <Text component="span" fw={600}>
                                    {selectedUser.name}
                                </Text>
                                ?
                            </>
                        ) : null
                    }
                    confirmLabel={confirmationLabel}
                    confirmColor={
                        selectedStatus ? confirmColors[selectedStatus] : 'red'
                    }
                    loading={updatingStatus}
                />
            </Stack>
        </>
    );
}
