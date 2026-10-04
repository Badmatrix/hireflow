import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import ResumeForm from '../component/ResumeForm';
import type { ResumeFormData } from '../types/resume';

export default function Create() {
    const form = useForm<ResumeFormData>({
        title: '',
        file: null,
        is_default: false,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post('/resumes', {
            forceFormData: true,
        });
      
    };

    return <ResumeForm form={form} onSubmit={submit} />;
}
