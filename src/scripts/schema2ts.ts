#!/usr/bin/env node

// const jsonSchema2TS = require('json-schema-to-typescript');
import { compileFromFile } from 'json-schema-to-typescript';
import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';

const DEFAULT_DST_SCHEMA = '../schema/dst.schema.json';
const DEFAULT_OUTPUT_FILE = '../types/dst.d.ts';

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
