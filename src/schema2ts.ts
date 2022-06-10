#!/usr/bin/env node

import { compileFromFile } from 'json-schema-to-typescript';
import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';

/**
 * TODO: Remove this comment
 * NOTE: This files work relative with the dist folder?
 */

const DEFAULT_DST_SCHEMA = './schema/dst.schema.json';
const DEFAULT_OUTPUT_FILE = './typings/dst.d.ts';

/**
 *
 * @param file Path to the file
 * @param output Path to the output
 */
function generateTypes(filePath?: string, outputPath?: string) {
    const DST_FILE_PATH = filePath ?? DEFAULT_DST_SCHEMA;
    const TS_OUTPUT_PATH = outputPath ?? DEFAULT_OUTPUT_FILE;
    const PATH_INPUT = path.resolve(__dirname, DST_FILE_PATH);
    const PATH_OUTPUT = path.resolve(__dirname, `${TS_OUTPUT_PATH}`);

    // Compile using json-schema-to-typescript lib
    compileFromFile(PATH_INPUT).then((ts) => fs.writeFileSync(PATH_OUTPUT, ts));
}

function main() {
    const args = minimist(process.argv);
    console.log('📢[schema2ts.ts:33]: ', args);
    const { i, o } = args;
    if (i && o) {
        let outputFolder = path.resolve(__dirname, path.dirname(o));
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(path.resolve(__dirname, path.dirname(o)));
        }
        generateTypes(i, o);
    } else {
        let outputFolder = path.resolve(__dirname, path.dirname(DEFAULT_OUTPUT_FILE));
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(path.resolve(__dirname, path.dirname(DEFAULT_OUTPUT_FILE)));
        }
        generateTypes();
    }
}

main();
