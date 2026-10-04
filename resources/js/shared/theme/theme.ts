import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'hireflowBlue',

    colors: {
        hireflowBlue: [
            '#EFF6FF',
            '#DBEAFE',
            '#BFDBFE',
            '#93C5FD',
            '#60A5FA',
            '#3B82F6',
            '#2563EB',
            '#1D4ED8',
            '#1E40AF',
            '#1E3A8A',
        ],
    },

    fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    headings: {
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',

        fontWeight: '600',

        sizes: {
            h1: {
                fontSize: rem(32),
                lineHeight: '1.2',
            },

            h2: {
                fontSize: rem(26),
                lineHeight: '1.25',
            },

            h3: {
                fontSize: rem(22),
                lineHeight: '1.3',
            },

            h4: {
                fontSize: rem(18),
                lineHeight: '1.4',
            },
        },
    },

    spacing: {
        xs: rem(8),
        sm: rem(12),
        md: rem(16),
        lg: rem(24),
        xl: rem(32),
    },

    radius: {
        xs: rem(4),
        sm: rem(6),
        md: rem(8),
        lg: rem(12),
        xl: rem(16),
    },

    defaultRadius: 'md',

    primaryShade: {
        light: 6,
        dark: 5,
    },

    defaultGradient: {
        from: 'hireflowBlue',
        to: 'blue',
        deg: 90,
    },

    shadows: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
        sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
        md: '0 4px 16px rgba(0, 0, 0, 0.08)',
        lg: '0 8px 30px rgba(0, 0, 0, 0.10)',
        xl: '0 16px 40px rgba(0, 0, 0, 0.12)',
    },

    components: {
        Button: {
            defaultProps: {
                radius: 'md',
                size: 'sm',
            },
        },

        TextInput: {
            defaultProps: {
                radius: 'md',
                size: 'sm',
            },
        },

        Textarea: {
            defaultProps: {
                radius: 'md',
                size: 'sm',
            },
        },

        Select: {
            defaultProps: {
                radius: 'md',
                size: 'sm',
            },
        },

        NumberInput: {
            defaultProps: {
                radius: 'md',
                size: 'sm',
            },
        },

        DateInput: {
            defaultProps: {
                radius: 'md',
                size: 'sm',
            },
        },

        Paper: {
            defaultProps: {
                radius: 'lg',
            },
        },

        Card: {
            defaultProps: {
                radius: 'lg',
            },
        },

        Badge: {
            defaultProps: {
                radius: 'sm',
            },
        },
      
        Modal: {
            defaultProps: {
                radius: 'lg',
            },
        },

        Menu: {
            defaultProps: {
                radius: 'md',
            },
        },
    },
});
