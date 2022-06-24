#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const minimist = require('minimist');
const findup = require('findup-sync');

/**
 * Creates the $schema path from where the theme file is created
 * @returns string
 */
function getSchemaPath() {
    const NODE_MODULES_DIR_PATH = findup('node_modules', { cwd: path.resolve('./') });
    const R2N_DST_SCHEMA_PATH = '@r2n/dst/schema/dst.schema.json';
    return `${NODE_MODULES_DIR_PATH}/${R2N_DST_SCHEMA_PATH}`;
}

/**
 * Find the theme json file and return it as object
 * @param {string} themeName
 * @returns theme object
 */
function getSchemaFileObj(themeName = 'default') {
    let themeFileName = getThemeFileName(themeName);
    let themesPath = path.resolve(__dirname, '../themes/');
    let themeFilePath = path.resolve(themesPath, themeFileName);
    let themeFile = require(themeFilePath);
    return themeFile;
}

function getThemeFileName(themeName = 'default') {
    return `${themeName}.dst.json`;
}

function getDestinationPath(destination = './') {
    return path.resolve(destination);
}

function main() {
    const args = minimist(process.argv);

    const { theme, dest } = args;

    const DESTINATION = dest ?? './';
    const THEME_NAME = theme ?? 'default';
    const DESTINATION_DIR_PATH = getDestinationPath(DESTINATION);
    const DESTIONATION_FILE_PATH = `${DESTINATION_DIR_PATH}/${getThemeFileName(theme)}`;

    let themeFile = getSchemaFileObj(THEME_NAME);

    // Replace $schema using the relative path to the schema
    themeFile['$schema'] = path.relative(DESTINATION, getSchemaPath());

    // Create destination directory if it does not exists
    if (!fs.existsSync(DESTINATION_DIR_PATH)) {
        fs.mkdirSync(DESTINATION_DIR_PATH, { recursive: true });
    }

    // Write file
    fs.writeFileSync(DESTIONATION_FILE_PATH, JSON.stringify(themeFile, null, 4));
}

main();
