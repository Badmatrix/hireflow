export type Resume = {
    id: number;
    user_id: number;
    title: string;
    file_path: string;
    file_name: string;
    file_type: string;
    file_size: number;
    is_default: boolean;
    created_at: string;
    updated_at: string;
};

export type ResumeFormData = {
    title: string;
    file: File | null;
    is_default: boolean;
};
