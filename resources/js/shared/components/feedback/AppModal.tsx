import { Group, Modal, Text  } from '@mantine/core';
import type {MantineColor} from '@mantine/core';
import type { ReactNode } from 'react';

import AppButton from '@/shared/components/ui/AppButton';

type ConfirmationModalProps = {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;

    title: string;
    description: ReactNode;

    confirmLabel?: string;
    confirmColor?: MantineColor;
    loading?: boolean;
};

export default function ConfirmationModal({
    opened,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    confirmColor = 'red',
    loading = false,
}: ConfirmationModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={title}
            centered
            size="md"
            transitionProps={{
                transition: 'fade',
                duration: 200,
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            closeOnClickOutside={!loading}
            closeOnEscape={!loading}
        >
            <Text size="sm" c="dimmed" lh={1.6}>
                {description}
            </Text>

            <Group justify="flex-end" gap="sm" mt="xl">
                <AppButton
                    variant="default"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </AppButton>

                <AppButton
                    color={confirmColor}
                    onClick={onConfirm}
                    loading={loading}
                >
                    {confirmLabel}
                </AppButton>
            </Group>
        </Modal>
    );
}
