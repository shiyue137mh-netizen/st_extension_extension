import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to copy files after build
const copyToTarget = () => {
    return {
        name: 'copy-to-target',
        closeBundle: async () => {
            const configPath = resolve(__dirname, '../../local-config.json');
            if (fs.existsSync(configPath)) {
                try {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                    if (config.targetDir && fs.existsSync(config.targetDir)) {
                        console.log(`\n[Vite] 🚀 Deploying to ${config.targetDir}...`);

                        const distDir = resolve(__dirname, 'dist');

                        // Clear target directory
                        const files = fs.readdirSync(config.targetDir);
                        files.forEach(file => {
                            const filePath = resolve(config.targetDir, file);
                            try {
                                if (fs.statSync(filePath).isFile()) {
                                    fs.unlinkSync(filePath);
                                } else if (fs.statSync(filePath).isDirectory()) {
                                    fs.rmSync(filePath, { recursive: true, force: true });
                                }
                            } catch (e) {
                                // Ignore
                            }
                        });

                        // Copy manifest.json from root to target root
                        const manifestSrc = resolve(__dirname, 'manifest.json');
                        const manifestDest = resolve(config.targetDir, 'manifest.json');
                        fs.copyFileSync(manifestSrc, manifestDest);

                        // Create dist subfolder in target
                        const targetDistDir = resolve(config.targetDir, 'dist');
                        if (!fs.existsSync(targetDistDir)) {
                            fs.mkdirSync(targetDistDir, { recursive: true });
                        }

                        // Copy index.js and style.css to target/dist/
                        const jsFile = resolve(distDir, 'index.js');
                        const cssFile = resolve(distDir, 'style.css');

                        if (fs.existsSync(jsFile)) {
                            fs.copyFileSync(jsFile, resolve(targetDistDir, 'index.js'));
                        }
                        if (fs.existsSync(cssFile)) {
                            fs.copyFileSync(cssFile, resolve(targetDistDir, 'style.css'));
                        }

                        console.log('[Vite] ✨ Deployment successful!');
                    }
                } catch (e) {
                    console.error('[Vite] Auto-deployment failed:', e);
                }
            }
        }
    };
};

export default defineConfig({
    plugins: [react(), copyToTarget()],
    define: {
        'process.env': {},
        'process.platform': JSON.stringify('browser'),
        'process.version': JSON.stringify(''),
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ExtensionExtension',
            fileName: (format) => `index.js`, // Output index.js directly for ESM
            formats: ['es'],
        },
        rollupOptions: {
            // Mark SillyTavern's runtime dependencies as external
            // Use regex to match without resolving
            external: (id) => {
                return id.includes('script.js') || id.includes('extensions.js');
            },
            output: {
                entryFileNames: 'index.js',
                format: 'es',
                // Tree-shake lucide-react icons - only bundle used ones
                manualChunks: undefined,
            }
        },
        outDir: 'dist',
        emptyOutDir: true,
        // Optimize for production
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false, // Keep console for debugging
                drop_debugger: true,
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});

