import { useForm } from '@inertiajs/react';
import type { InertiaFormProps } from '@inertiajs/react';
import CompanyForm from '../components/CompanyForm';
import type { CompanyFormData } from '../types/company';

export type CompanyFormType = InertiaFormProps<CompanyFormData>;
export type CompanyFormProps = {
    form: CompanyFormType;
    submitLabel: string;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
};

export default function CreateCompany() {
    const form = useForm<CompanyFormData>({
        name: '',
        website: '',
        email: '',
        phone: '',
        location: '',
        company_type: '',
        slogan: '',
        description: '',
    });

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        form.post('/companies');
    };

    return (
        <CompanyForm
            form={form}
            onSubmit={handleSubmit}
            submitLabel="Create Company"
        />
    );
}
