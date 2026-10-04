
import type { Job } from "@/pages/jobs/types/job";


export function formatSalary(job: Job): string {
    if (job.salary_min === null && job.salary_max === null) {
        return 'Not disclosed';
    }

    if (job.salary_min !== null && job.salary_max !== null) {
        return `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}`;
    }

    if (job.salary_min !== null) {
        return `From ${formatCurrency(job.salary_min)}`;
    }

    return `Up to ${formatCurrency(job.salary_max!)}`;
}

export function formatCurrency(value: string): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

export function formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
    }).format(new Date(date));
}
