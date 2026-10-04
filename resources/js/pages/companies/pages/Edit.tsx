import { useForm } from '@inertiajs/react';

import CompanyForm from '../components/CompanyForm';
import type { Company, CompanyFormData } from '../types/company';

type EditCompanyProps = {
    company: Company;
};

export default function EditCompany({ company }: EditCompanyProps) {
    const form = useForm<CompanyFormData>({
        name: company.name ?? '',
        website: company.website ?? '',
        email: company.email ?? '',
        phone: company.phone ?? '',
        location: company.location ?? '',
        company_type: company.company_type ?? '',
        slogan: company.slogan ?? '',
        description: company.description ?? '',
    });

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        form.put(`/companies/${company.id}`);
    };

    return (
        <CompanyForm
            form={form}
            onSubmit={handleSubmit}
            submitLabel="Update Company"
        />
    );
}
