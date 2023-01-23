import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import copy from "rollup-plugin-copy"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        rollupOptions: {
            // REF https://rollupjs.org/guide/en/#big-list-of-options
            output: [
                {
                    assetFileNames: "content-script/index[extname]",
                    entryFileNames: "content-script/index.js",
                },
                {
                    assetFileNames: "static/[name]-[hash][extname]",
                    entryFileNames: "static/[name]-[hash].js",
                },
            ],
            plugins: [
                copy({
                    targets: [
                        {
                            src: "./src/assets/*",
                            dest: "./dist/assets"
                        },
                    ],
                }),
            ],
        },
    },
})
