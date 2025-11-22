import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const CORE_DIR = path.resolve(__dirname, '../packages/core');
const DIST_DIR = path.join(CORE_DIR, 'dist');

// Read local config
const localConfigPath = path.resolve(__dirname, '../local-config.json');
let targetDir: string | null = null;

if (fs.existsSync(localConfigPath)) {
    try {
        const config = JSON.parse(fs.readFileSync(localConfigPath, 'utf-8'));
        targetDir = config.targetDir;
    } catch (e) {
        console.error(chalk.red('Failed to read local-config.json'), e);
    }
}

console.log(chalk.cyan('Packaging Extension Extension Core...'));

// 1. Copy manifest.json to dist (for bundled distribution)
const manifestSrc = path.join(CORE_DIR, 'manifest.json');
const manifestDest = path.join(DIST_DIR, 'manifest.json');
fs.copyFileSync(manifestSrc, manifestDest);
console.log(chalk.green('Copied manifest.json to dist'));

// 2. Deploy to target directory if configured
if (targetDir && fs.existsSync(targetDir)) {
    console.log(chalk.cyan(`\nDeploying to ${targetDir}...`));

    // Remove old files in target
    if (fs.existsSync(targetDir)) {
        fs.emptyDirSync(targetDir);
    }

    // Copy entire dist folder contents to target
    fs.copySync(DIST_DIR, targetDir, {
        overwrite: true,
        filter: (src) => {
            // Skip node_modules and other unwanted files
            return !src.includes('node_modules');
        }
    });

    console.log(chalk.green('Deployment successful! ✨'));
} else {
    console.log(chalk.yellow('\nNo target directory configured or directory does not exist.'));
    console.log(chalk.yellow('Create local-config.json with targetDir to enable auto-deployment.'));
}

// 3. Show instructions
console.log(chalk.cyan('\nDeployment Instructions:'));
console.log(`1. Copy the entire folder: ${chalk.bold(DIST_DIR)}`);
console.log(`2. Paste it into: ${chalk.bold('SillyTavern/public/scripts/extensions/extension-extension')}`);
console.log(chalk.gray('\nNote: The dist folder contains manifest.json, index.js, and style.css'));
console.log(chalk.gray('Manifest.json uses dist/index.js and dist/style.css paths'));
