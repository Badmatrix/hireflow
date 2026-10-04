import { notifications } from '@mantine/notifications';
import { Check, X } from 'lucide-react';
import { useEffect } from 'react';

type FlashProps = {
    success: string | null;
    error: string | null;
};

type PageProps = {
    flash: FlashProps;
};

export default function FlashNotification({ flash }: PageProps) {
    useEffect(() => {
        if (flash.success !== null) {
            notifications.show({
                title: 'Success',
                message: flash.success,
                color: 'teal',
                icon: <Check size={18} />,
                
            });
        }

        if (flash.error) {
            notifications.show({
                title: 'Error',
                message: flash.error,
                color: 'red',
                icon: <X size={18} />,
            });
        }
    }, [flash.success, flash.error]);

    return null;
}
