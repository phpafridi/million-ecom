import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});
import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

createInertiaApp({
    title: (title) => title ? `${title} — MILLIONAIRE` : 'MILLIONAIRE — Wear Your Status',
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.tsx`,
        import.meta.glob('./Pages/**/*.tsx')
    ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
    progress: { color: 'var(--color-primary, #00c8ff)', showSpinner: true },
})
