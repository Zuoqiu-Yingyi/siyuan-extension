import { defineConfig } from "vite"
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'

import vue from "@vitejs/plugin-vue"
import copy from "rollup-plugin-copy"
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        /**
         * REF: [vue3 with vue-i18n-next only works with unsafe-eval CSP header · Issue #543 · intlify/vue-i18n-next · GitHub](https://github.com/intlify/vue-i18n-next/issues/543)
         * REF: [Optimization | unplugin-vue-i18n | Vue I18n](https://vue-i18n.intlify.dev/guide/advanced/optimization.html#how-to-configure)
         */
        VueI18nPlugin({
            /* options */
            // locale messages resourece pre-compile option
            include: resolve(dirname(fileURLToPath(import.meta.url)), "./src/locales/*"),
        }),
    ],
    build: {
        // sourcemap: "inline",
        emptyOutDir: false,
        rollupOptions: {
            // REF https://rollupjs.org/guide/en/#big-list-of-options
            output: [
                {
                    assetFileNames: "firefox/content-script/index[extname]",
                    entryFileNames: "firefox/content-script/index.js",
                    // format: 'iife',
                },
                {
                    assetFileNames: "chromium/content-script/index[extname]",
                    entryFileNames: "chromium/content-script/index.js",
                    // format: 'iife',
                },
                {
                    assetFileNames: "assets/[name]-[hash][extname]",
                    entryFileNames: "assets/[name]-[hash].js",
                },
            ],
            plugins: [
                copy({
                    targets: [
                        {
                            src: "src/_locales/*",
                            dest: [
                                "dist/firefox/_locales",
                                "dist/chromium/_locales",
                            ],
                        },
                        {
                            src: "src/assets/*",
                            dest: [
                                "dist/firefox/assets",
                                "dist/chromium/assets",
                            ],
                        },
                        {
                            src: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
                            dest: [
                                "dist/firefox",
                                "dist/chromium",
                            ],
                            rename: "webextension-polyfill.js",
                        },
                        {
                            src: "src/manifest.v2.json",
                            dest: "dist/firefox",
                            rename: "manifest.json",
                        },
                        {
                            src: "src/manifest.json",
                            dest: "dist/chromium",
                            rename: "manifest.json",
                        },
                    ],
                    verbose: true,
                }),
            ],
        },
    },
})
