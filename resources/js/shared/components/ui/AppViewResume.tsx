import { Link } from '@inertiajs/react';
import { Download } from 'lucide-react';
import AppButton from './AppButton';
type Props = {
    href: string;
};

export default function AppViewResume({ href }: Props) {
    return (
        <Link href={href} target="_blank">
            <AppButton
                variant="light"
                leftSection={<Download size={15} />}
                rel="noopener noreferrer"
            >
                View Resume
            </AppButton>
        </Link>
    );
}
