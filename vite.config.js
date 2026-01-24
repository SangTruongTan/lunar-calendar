import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    // Base path must match your repository name for GitHub Pages project sites
    base: '/lunar-calendar/',
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifestFilename: 'manifest.json',
            includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                name: 'Lunar Calendar',
                short_name: 'Lunar',
                description: 'An offline-capable lunar calendar app with solar/lunar date tracking, zodiac information, and daily quotes',
                theme_color: '#1a1a1a',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/lunar-calendar/',
                scope: '/lunar-calendar/',
                icons: [
                    {
                        src: '/lunar-calendar/pwa-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/lunar-calendar/pwa-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/lunar-calendar/pwa-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: '/lunar-calendar/pwa-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ],
                screenshots: [],
                categories: ['productivity', 'lifestyle']
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
                cleanupOutdatedCaches: true,
                navigateFallback: '/lunar-calendar/index.html'
            },
            devOptions: {
                enabled: true,
                navigateFallback: 'index.html'
            }
        })
    ]
})
