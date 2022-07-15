#!/usr/bin/env node

import minimist from 'minimist';
import { getHelpItems, HelpItem } from './scripts/help';
import { setup } from './scripts/setup';
import { Logger } from './utils/logger';

const log = new Logger();

function validArgs(args: minimist.ParsedArgs): boolean {
    const excludedArgs: string[] = ['_', 'debug'];
    const validArgs: string[] = [];
    let valid = true;

    // Transform and push avery option to the valid args array,
    // this will transform -a to a, or --awesome to awesome
    getHelpItems().forEach((item: HelpItem) => {
        validArgs.push(...item.options.split(',').map((op) => op.replace(/-|--/gi, '')));
    });

    Object.keys(args).forEach((k: string) => {
        if (!excludedArgs.includes(k) && !validArgs.includes(k)) {
            valid = false;
            log.warn(`Argument [ ${k} ] is not valid. Run 'r2ndst --help' to see script usage.`);
        }
    });

    return valid;
}

function main(): void {
    const args = minimist(process.argv);
    const { init } = args;
    if (validArgs(args)) {
        if (init) {
            setup(args);
        }
    }
}

main();
