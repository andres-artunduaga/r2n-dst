#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { CURRENT_DIR, DST_REF_REGEX } from '../shared/constants';
import { Logger } from '../utils/logger';

const log = new Logger();

function getFile(filePath: string) {
    let schemaFile = require(`${path.resolve(filePath)}`);
    return schemaFile;
}

function getValueFromObject(obj: any, dotProps: string): string {
    let _obj = obj;
    const props = dotProps.split('.');
    const prop = props.shift();
    if (prop) {
        if (_obj[prop]) {
            return getValueFromObject(_obj[prop], props.join('.'));
        } else {
            log.error(`Unable to find [ ${dotProps} ] in dst file`);
            return '';
        }
    } else {
        return _obj;
    }
}

function transformReference(value: string, file: any) {
    DST_REF_REGEX.lastIndex = 0; // Reset regex last index to avoid matching issues

    let result = '';

    for (let match of value.matchAll(DST_REF_REGEX)) {
        const dotProps = match[1];
        const realValue = getValueFromObject(file.definition, dotProps);
        result = result ? result.replace(match[0], realValue) : value.replace(match[0], realValue);
    }

    if (DST_REF_REGEX.test(result)) {
        result = transformReference(result, file);
    }

    return result ? result : value;
}

function dstToJson(dstFilePath: string, fileName: string, destination: string = CURRENT_DIR) {
    const dstFile = getFile(dstFilePath);

    let _fileName = fileName;
    let transformedFile;

    // $schema is no needed in the transformed file
    if (dstFile.$schema) {
        delete dstFile.$schema;
    }

    if (fileName.endsWith('.json')) {
        _fileName = fileName.slice(0, -5);
    }

    const FULL_DESTINATION = `${destination}${
        destination.slice(-1) === '/' ? '' : '/'
    }${_fileName}.json`;

    try {
        transformedFile = JSON.stringify(
            dstFile,
            (_, value: any) => {
                if (typeof value === 'string') {
                    return transformReference(value, dstFile);
                } else {
                    return value;
                }
            },
            4
        );

        if (!fs.existsSync(FULL_DESTINATION)) {
            fs.writeFileSync(FULL_DESTINATION, transformedFile);
        } else {
            throw Error(`File ${FULL_DESTINATION} already exist`);
        }
    } catch (e) {
        if (e instanceof Error) {
            log.error('Unable to transform dst file', e.message);
        } else {
            log.error('Error: ', e);
        }
    }
}

export { dstToJson };
