export type NotificationData = {
    type: string;
    application_id: number;
    job_id: number;
    job_title: string;
    company_name: string;
    old_status: string;
    new_status: string;
};

export type NotificationType = {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
};