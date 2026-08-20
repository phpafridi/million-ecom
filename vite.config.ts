import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [
        laravel({
            input:   'resources/js/app.tsx',
            ssr:     'resources/js/ssr.tsx',  // ✅ SSR entry
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
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
})
