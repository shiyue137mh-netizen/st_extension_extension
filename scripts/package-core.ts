import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const DIST_DIR = path.resolve(__dirname, '../packages/core/dist');
const MANIFEST_SRC = path.resolve(__dirname, '../packages/core/manifest.json');
const MANIFEST_DEST = path.join(DIST_DIR, 'manifest.json');

async function packageCore() {
    console.log(chalk.blue('Packaging Extension Extension Core...'));

    if (!fs.existsSync(DIST_DIR)) {
        console.error(chalk.red('Error: Core dist directory not found. Run "pnpm build" first.'));
        process.exit(1);
    }

    // Copy manifest
    await fs.copy(MANIFEST_SRC, MANIFEST_DEST);
    console.log(chalk.green(`Copied manifest.json to ${DIST_DIR}`));

    console.log(chalk.yellow('\nDeployment Instructions:'));
    console.log(`1. Copy the folder: ${chalk.cyan(DIST_DIR)}`);
    console.log(`2. Paste it into: ${chalk.cyan('SillyTavern/public/scripts/extensions/extension-extension')}`);
}

packageCore();
