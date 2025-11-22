import { build as viteBuild } from 'vite';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
export async function buildExtension(cwd) {
    console.log(chalk.blue(`Building extension in ${cwd}...`));
    const manifestPath = path.join(cwd, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        console.error(chalk.red('manifest.json not found!'));
        process.exit(1);
    }
    const manifest = await fs.readJson(manifestPath);
    const entryPoint = path.join(cwd, 'src/index.ts'); // Default entry
    if (!fs.existsSync(entryPoint)) {
        console.error(chalk.red(`Entry point not found at ${entryPoint}`));
        process.exit(1);
    }
    const config = {
        root: cwd,
        build: {
            lib: {
                entry: entryPoint,
                name: manifest.name.replace(/[^a-zA-Z0-9_]/g, '_'), // Sanitize name
                fileName: () => 'index.js',
                formats: ['iife'],
            },
            rollupOptions: {
                external: ['react', 'react-dom', '@extension-extension/core'],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        '@extension-extension/core': 'ExtensionExtension',
                    },
                },
            },
            outDir: 'dist',
            emptyOutDir: true,
        },
    };
    try {
        await viteBuild(config);
        console.log(chalk.green('Build successful!'));
        // Copy manifest to dist
        await fs.copy(manifestPath, path.join(cwd, 'dist/manifest.json'));
    }
    catch (e) {
        console.error(chalk.red('Build failed:'), e);
        process.exit(1);
    }
}
