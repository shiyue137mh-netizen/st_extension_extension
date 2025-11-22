import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ExtensionExtension',
            fileName: (format) => `index.${format}.js`,
            formats: ['iife'], // SillyTavern needs a single script usually, or we can use 'es' if we use a module loader
        },
        rollupOptions: {
            // Ensure we don't bundle React if we want to share it, 
            // BUT for the Core, we might want to bundle it to expose it to others.
            // For now, let's bundle everything into the Core so it acts as the provider.
            external: [],
            output: {
                // Global variable name for IIFE
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
