import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

export default function render(page: any) {
    return createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => title
            ? `${title} — MILLIONAIRE`
            : 'MILLIONAIRE — Wear Your Status',
        resolve: (name) => resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
        setup: ({ App, props }) => <App {...props} />,
    })
}
