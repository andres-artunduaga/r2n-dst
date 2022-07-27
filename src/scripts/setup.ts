#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import findupSync from 'findup-sync';
import minimist from 'minimist';
import { Logger } from '../utils/logger';

// Constants
const CURRENT_DIR = './';
const DEFAULT_DST_DIR = 'dst';
const DEFAULT_SCHEMA_DIR = `${DEFAULT_DST_DIR}/schema`;
const DEFAULT_THEMES_DIR = `${DEFAULT_DST_DIR}/themes`;
const DEFAULT_SCHEMA_FILE_NAME = getSchemaFileName();
const DEFAULT_THEME = 'default';
const DEFAULT_SCHEMA_FILE_PATH = `${DEFAULT_SCHEMA_DIR}/${DEFAULT_SCHEMA_FILE_NAME}`;

const log = new Logger();

function getThemeFileName(theme: string): string {
    return `${theme}.dst.json`;
}

function getSchemaFileName() {
    return 'dst.schema.json';
}

function getThemeFilePath(theme: string): string {
    return `${DEFAULT_THEMES_DIR}/${getThemeFileName(theme)}`;
}

function createDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        log.info(`Creating directory `, dirPath);
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function createFile(filePath: string, data: any): void {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    } else {
        log.warn(`File [ ${filePath} ] already exists, skipping file creation...`);
    }
}

function getSchemaDestinationPath(destination = CURRENT_DIR) {
    return path.resolve(destination, DEFAULT_SCHEMA_DIR);
}

function getThemeDestinationPath(destination = CURRENT_DIR) {
    return path.resolve(destination, DEFAULT_THEMES_DIR);
}

function getSchemaFileObj() {
    let SCHEMA_FILE_PATH = findupSync(DEFAULT_SCHEMA_FILE_PATH, { cwd: path.resolve(CURRENT_DIR) });
    let schemaFile = require(`${SCHEMA_FILE_PATH}`);
    return schemaFile;
}

function getThemeFileObj(theme: string) {
    let SCHEMA_FILE_PATH = findupSync(getThemeFilePath(theme), {
        cwd: path.resolve(CURRENT_DIR),
    });
    let schemaFile = require(`${SCHEMA_FILE_PATH}`);
    return schemaFile;
}

function copySchema(destination: string = CURRENT_DIR) {
    try {
        log.info('Copying schema...');
        const dest = getSchemaDestinationPath(destination);
        createDir(dest);
        const schemaObj = getSchemaFileObj();
        if (schemaObj) {
            createFile(`${dest}/${DEFAULT_SCHEMA_FILE_NAME}`, schemaObj);
        }
    } catch (e) {
        throw new Error('Unable to copy schema file');
    }
}

function copyTheme(destination: string = CURRENT_DIR, theme: string = DEFAULT_THEME) {
    try {
        log.info('Copying theme...');
        const dest = getThemeDestinationPath(destination);
        createDir(dest);
        const themeObject = getThemeFileObj(theme);
        if (themeObject) {
            createFile(`${dest}/${getThemeFileName(theme)}`, themeObject);
        }
    } catch (e) {
        throw new Error('Unable to copy theme file');
    }
}

function revertChanges(destination = CURRENT_DIR) {
    log.info('Reverting changes...');
    let dest = path.resolve(destination);
    if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true });
    }
    log.success('Revert completed');
}

function setup(args: minimist.ParsedArgs) {
    log.info('Initializing DST files');
    let { init, destination, theme } = args;
    try {
        if (init) {
            log.info('Using custom destination', destination);
            copySchema(destination);
            copyTheme(destination, theme);
        }
    } catch (e) {
        if (e instanceof Error) {
            log.error('Unable to initialize DST files ::', e.message);
            revertChanges(destination);
        } else {
            log.error('Err', e);
        }
        process.exit(1);
    }
}

export { setup };
