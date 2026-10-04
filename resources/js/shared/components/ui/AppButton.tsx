import type { ButtonProps } from '@mantine/core';
import { Button } from '@mantine/core';
import type { ComponentPropsWithoutRef } from 'react';

type AppButtonProps = ButtonProps & ComponentPropsWithoutRef<'button'>;

export default function AppButton({ children, ...props }: AppButtonProps) {
    return <Button {...props}>{children}</Button>;
}
