import chalk from 'chalk';

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

    private withPrefix(message: string, level?: Level) {
        let msg: string;
        if (level) {
            let { prefix, color } = this.getLevelInformation(level);
            msg = chalk.keyword(color)(chalk.bold(`[${prefix}]  \n └`), message);
        } else {
            msg = chalk(message);
        }
        return msg;
    }

    log(message: string, level?: Level, ...optionalParams: any[]): void {
        console.log(this.withPrefix(message, level), ...optionalParams);
    }

    info(message: string, ...optionalParams: any[]) {
        this.log(message, 'info', ...optionalParams);
    }

    success(message: string, ...optionalParams: any[]) {
        this.log(message, 'success', ...optionalParams);
    }

    error(message: string, ...optionalParams: any[]) {
        this.log(message, 'error', ...optionalParams);
    }

    warn(message: string, ...optionalParams: any[]) {
        this.log(message, 'warning', ...optionalParams);
    }

    debug(message: string, ...optionalParams: any[]) {
        this.log(message, 'debug', ...optionalParams);
    }
}
