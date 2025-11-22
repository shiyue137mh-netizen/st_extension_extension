import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': {},
        'process.platform': JSON.stringify('browser'),
        'process.version': JSON.stringify(''),
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ExtensionExtension',
            fileName: (format) => `index.${format}.js`,
            formats: ['iife'],
        },
        rollupOptions: {
            external: [],
            output: {
                name: 'ExtensionExtension',
                globals: {}
            }
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});
