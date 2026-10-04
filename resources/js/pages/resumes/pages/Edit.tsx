import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import ResumeForm from '../component/ResumeForm';
import type { Resume, ResumeFormData } from '../types/resume';

type EditProps = {
    resume: Resume;
};

export default function Edit({ resume }: EditProps) {
    const form = useForm<ResumeFormData>({
        title: resume.title,
        file: null,
        is_default: resume.is_default,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            _method: 'PUT',
        }));

        form.post(`/resumes/${resume.id}`, {
            forceFormData: true,
        });
    };

    return (
        <ResumeForm
            form={form}
            editing
            currentFileName={resume.file_name}
            onSubmit={submit}
        />
    );
}
