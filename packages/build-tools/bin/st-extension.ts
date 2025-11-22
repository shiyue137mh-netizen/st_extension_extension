#!/usr/bin/env node
import { Command } from 'commander';
import { buildExtension } from '../src/build.js';

const program = new Command();

program
    .name('st-extension')
    .description('CLI for building SillyTavern extensions')
    .version('2.0.0');

program.command('build')
    .description('Build the extension')
    .action(async () => {
        await buildExtension(process.cwd());
    });

program.parse();
