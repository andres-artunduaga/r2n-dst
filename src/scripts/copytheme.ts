#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import findupSync from 'findup-sync';
import minimist from 'minimist';

/**
 * Creates the $schema path from where the theme file is created
 * @param {string} destination relative path to destination folder
 * @returns string
 */
function getSchemaPath(destination: string) {
    const NODE_MODULES_DIR_PATH = findupSync('node_modules', { cwd: path.resolve('./') });
    const R2N_DST_SCHEMA_PATH = '@r2n/dst/schema/dst.schema.json';
    return path.relative(destination, `${NODE_MODULES_DIR_PATH}/${R2N_DST_SCHEMA_PATH}`);
}

/**
 * Find the theme json file and return it as object
 * @param {string} themeName
 * @returns theme object
 */
function getSchemaFileObj(themeName: string = 'default') {
    let themeFileName = getThemeFileName(themeName);
    let themesPath = path.resolve(__dirname, '../themes/');
    let themeFilePath = path.resolve(themesPath, themeFileName);
    let themeFile = require(themeFilePath);
    return themeFile;
}

/**
 * Return the theme file name based on the theme name
 * @param {*} themeName theme name
 * @returns string
 */
function getThemeFileName(themeName:string = 'default') {
    return `${themeName}.dst.json`;
}

/**
 * This returns the full path where the dst file will live
 * @param {*} destination relative folder path where the dst file will live
 * @returns string
 */
function getDestinationPath(destination = './') {
    return path.resolve(destination);
}

function copytheme() {
    const args = minimist(process.argv);

    const { theme, dest, ns } = args;

    const DESTINATION = dest ?? './';
    const THEME_NAME = theme ?? 'default';
    const NAMESPACE = ns ?? 'r2n';
    const DESTINATION_DIR_PATH = getDestinationPath(DESTINATION);
    const DESTIONATION_FILE_PATH = `${DESTINATION_DIR_PATH}/${getThemeFileName(theme)}`;

    let themeFile = getSchemaFileObj(THEME_NAME);

    // Replace $schema using the relative path to the schema
    themeFile['$schema'] = getSchemaPath(DESTINATION);
    themeFile['metadata']['namespace'] = NAMESPACE;
    console.log(
        "📢[copytheme.js:65]: themeFile['metadata']['namespace']",
        themeFile['metadata']['namespace']
    );

    // Create destination directory if it does not exists
    if (!fs.existsSync(DESTINATION_DIR_PATH)) {
        fs.mkdirSync(DESTINATION_DIR_PATH, { recursive: true });
    }

    // Write file
    fs.writeFileSync(DESTIONATION_FILE_PATH, JSON.stringify(themeFile, null, 4));
}

export {
    copytheme
}
