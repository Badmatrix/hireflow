export type roleType = 'admin' | 'employer' | 'job seeker';
export type Role = {
    id: number;
    name: roleType;
};

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    phone?: string | null;
    role_id: number;
    role: Role;
};

export type Auth = {
    user: AuthUser | null;
};
