import chalk from 'chalk';
import { error } from 'console';
// const chalk = require('chalk');

type Level = 'debug' | 'info' | 'success' | 'error' | 'warning';
type LevelColor = 'gray' | 'blue' | 'green' | 'red' | 'yellow';
type LevelData = { prefix: string; color: LevelColor };

const levelInformation: Record<Level, LevelData> = {
    debug: {
        prefix: 'DEBUG',
        color: 'gray',
    },
    info: {
        prefix: 'INFO',
        color: 'blue',
    },
    success: {
        prefix: 'SUCCESS',
        color: 'green',
    },
    error: {
        prefix: 'ERROR',
        color: 'red',
    },
    warning: {
        prefix: 'WARNING',
        color: 'yellow',
    },
};

/**
 * Class to manage logs
 */
export class Logger {
    constructor() {}

    private getLevelInformation(level: Level): LevelData {
        return levelInformation[level];
    }

    private withPrefix(level: Level, message: string) {
        let { prefix, color } = this.getLevelInformation(level);
        return chalk.keyword(color)(chalk.bold(`[${prefix}]  \n └`), message);
    }

    log(level: Level, message: string, ...optionalParams: any[]): void {
        console.log(this.withPrefix(level, message), ...optionalParams);
    }

    info(message: string, ...optionalParams: any[]) {
        this.log('info' ,message, ...optionalParams);
    }

    success(message: string, ...optionalParams: any[]) {
        this.log('success', message, ...optionalParams);
    }

    error(message: string, ...optionalParams: any[]) {
        this.log('error', message, ...optionalParams);
    }

    warn(message: string, ...optionalParams: any[]) {
        this.log('warning', message, ...optionalParams);
    }

    debug(message: string, ...optionalParams: any[]) {
        this.log('debug', message, ...optionalParams);
    }
}
