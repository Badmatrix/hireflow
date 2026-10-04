import { Container } from '@mantine/core';

type PageContainerProps = {
    children: React.ReactNode;
};

export default function PageContainer({ children }: PageContainerProps) {
    return (
        <Container
            size="xl"
            px={{
                base: 'md',
                sm: 'lg',
                lg: 'xl',
            }}
            py={{
                base: 'md',
                sm: 'xl',
            }}
        >
            {children}
        </Container>
    );
}
