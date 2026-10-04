/* eslint-disable import/order */
import { createInertiaApp } from '@inertiajs/react';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import '@mantine/core/styles.css';
import AppProviders from '@/components/app-provider';

const appName = import.meta.env.VITE_APP_NAME || 'Hireflow';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;

            case name.startsWith('error/'):
                return null;

            case name.startsWith('auth/'):
                return AuthLayout;

            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];

            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return <AppProviders>{app}</AppProviders>;
    },

    progress: {
        color: '#2563EB',
    },
});

initializeTheme();
