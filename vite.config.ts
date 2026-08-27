import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [
        laravel({
            input:   'resources/js/app.tsx',
            ssr:     'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    ssr: {
        noExternal: ['@inertiajs/react'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    // Suppress the useLayoutEffect warning from @inertiajs/react SSR bundle
    // It's a harmless warning — useLayoutEffect is tree-shaken out in SSR
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                if (
                    warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
                    warning.exporter === 'react' &&
                    warning.names?.includes('useLayoutEffect')
                ) return  // suppress this specific warning
                warn(warning)
            },
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
})
