import type { Application } from '@/pages/applications/types/application';
import type { NotificationType } from '@/pages/notifications/types/Notification';

export type ApplicationStats = {
    total: number;
    pending: number;
    reviewing: number;
    shortlisted: number;
    hired: number;
    rejected: number;
    withdrawn: number;
};

export type DashboardProps = {
    applicationStats: ApplicationStats;
    applications: Application[];
    notifications: NotificationType[];
};
