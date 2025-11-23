import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const CORE_DIR = path.resolve(__dirname, '../packages/core');
const DIST_DIR = path.join(CORE_DIR, 'dist');
const MANIFEST_SRC = path.join(CORE_DIR, 'manifest.json');

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

console.log(chalk.cyan('\n📦 Extension Extension - One-Click Deploy\n'));

// Check if dist exists
if (!fs.existsSync(DIST_DIR)) {
    console.error(chalk.red('❌ Error: dist directory not found!'));
    console.error(chalk.yellow('   Please run "pnpm run build" first.'));
    process.exit(1);
}

// Deploy to target directory if configured
if (targetDir) {
    if (!fs.existsSync(targetDir)) {
        console.log(chalk.yellow(`⚠️  Target directory does not exist, creating: ${targetDir}`));
        fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log(chalk.cyan(`📂 Deploying to: ${targetDir}\n`));

    // Clear target directory
    fs.emptyDirSync(targetDir);

    // Copy manifest.json to target root
    fs.copyFileSync(MANIFEST_SRC, path.join(targetDir, 'manifest.json'));
    console.log(chalk.green('   ✓ manifest.json'));

    // Create dist subfolder in target
    const targetDistDir = path.join(targetDir, 'dist');
    fs.mkdirSync(targetDistDir, { recursive: true });

    // Copy index.js to target/dist/
    const indexSrc = path.join(DIST_DIR, 'index.js');
    if (fs.existsSync(indexSrc)) {
        fs.copyFileSync(indexSrc, path.join(targetDistDir, 'index.js'));
        console.log(chalk.green('   ✓ dist/index.js'));
    }

    // Copy style.css to target/dist/
    const styleSrc = path.join(DIST_DIR, 'style.css');
    if (fs.existsSync(styleSrc)) {
        fs.copyFileSync(styleSrc, path.join(targetDistDir, 'style.css'));
        console.log(chalk.green('   ✓ dist/style.css'));
    }

    console.log(chalk.green.bold('\n✨ Deployment successful!\n'));
} else {
    console.log(chalk.yellow('⚠️  No target directory configured.'));
    console.log(chalk.cyan('\nTo enable auto-deployment:'));
    console.log(chalk.gray('1. Copy local-config.example.json to local-config.json'));
    console.log(chalk.gray('2. Set targetDir to your SillyTavern extension path\n'));
}

// Show structure
console.log(chalk.cyan('📋 Deployed Structure:\n'));
console.log(chalk.gray('extension-extension/'));
console.log(chalk.gray('├── manifest.json (points to dist/index.js)'));
console.log(chalk.gray('└── dist/'));
console.log(chalk.gray('    ├── index.js'));
console.log(chalk.gray('    └── style.css'));
console.log('');
