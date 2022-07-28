import chalk, { ChalkFunction } from 'chalk';

type TabulatorItem = Record<string, string>[];

export class Tabulator {
    private dimentions: Record<string, number> = {};
    private FILL_STR = ' ';
    private items: TabulatorItem;
    private TABLE_BLOCKS = {
        TOP_LEFT: '┌',
        TOP_MID: '┬',
        TOP_RIGHT: '┐',
        HORIZONTAL: '─',
        VERTICAL: '│',
        LEFT: '├',
        MID: '┼',
        RIGHT: '┤',
        BOTTOM_LEFT: '└',
        BOTTOM_MID: '┴',
        BOTTOM_RIGHT: '┘',
    };

    constructor(item: TabulatorItem) {
        this.items = item;
        this.calculateDimentions();
    }

    print() {
        this.printHeader();
        this.printRows();
    }

    // Private

    private calculateDimentions() {
        this.dimentions = {};
        this.items.forEach((i) => {
            Object.keys(i).forEach((k: string) => {
                this.dimentions[k] =
                    this.dimentions[k] > i[k].length ? this.dimentions[k] : i[k].length + 4;
            });
        });
    }

    private printHeader() {
        let headerTop = `${this.TABLE_BLOCKS.TOP_LEFT}`;
        let headerMid = `${this.TABLE_BLOCKS.VERTICAL}`;
        let headerBot = `${this.TABLE_BLOCKS.LEFT}`;

        Object.keys(this.dimentions).forEach((k: string, idx: number, arr: string[]) => {
            headerTop += `${this.TABLE_BLOCKS.HORIZONTAL.repeat(this.dimentions[k])}`;
            headerMid += this.centerText(k, this.dimentions[k], chalk.whiteBright.bold);
            headerBot += `${this.TABLE_BLOCKS.HORIZONTAL.repeat(this.dimentions[k])}`;
            if (idx + 1 === arr.length) {
                headerTop += `${this.TABLE_BLOCKS.TOP_RIGHT}`;
                headerMid += `${this.TABLE_BLOCKS.VERTICAL}`;
                headerBot += `${this.TABLE_BLOCKS.RIGHT}`;
            } else {
                headerTop += `${this.TABLE_BLOCKS.TOP_MID}`;
                headerMid += `${this.TABLE_BLOCKS.VERTICAL}`;
                headerBot += `${this.TABLE_BLOCKS.MID}`;
            }
        });

        console.log(chalk(headerTop));
        console.log(chalk(headerMid));
        console.log(chalk(headerBot));
    }

    private printRows() {
        this.items.forEach((item: Record<string, string>, idx: number) => {
            let isLast = idx === this.items.length - 1;
            this.printRow(item, isLast);
        });
    }

    private printRow(item: Record<string, string>, isLast: boolean) {
        let rowMid = `${this.TABLE_BLOCKS.VERTICAL}`;
        let rowBot = `${this.TABLE_BLOCKS.LEFT}`;

        if (isLast) {
            rowBot = `${this.TABLE_BLOCKS.BOTTOM_LEFT}`;
        }

        Object.keys(this.dimentions).forEach((k: string, idx: number, arr: string[]) => {
            const itemValue = item[k] ?? "";
            rowMid += `${this.centerText(itemValue, this.dimentions[k], chalk.yellow)}`;
            rowBot += `${this.TABLE_BLOCKS.HORIZONTAL.repeat(this.dimentions[k])}`;
            if (idx === arr.length - 1) {
                rowMid += `${this.TABLE_BLOCKS.VERTICAL}`;
                rowBot += isLast
                    ? `${this.TABLE_BLOCKS.BOTTOM_RIGHT}`
                    : `${this.TABLE_BLOCKS.RIGHT}`;
            } else {
                rowMid += `${this.TABLE_BLOCKS.VERTICAL}`;
                rowBot += isLast ? `${this.TABLE_BLOCKS.BOTTOM_MID}` : `${this.TABLE_BLOCKS.MID}`;
            }
        });

        console.log(chalk(rowMid));
        console.log(chalk(rowBot));
    }

    private alignText(
        align: 'center' | 'left' | 'right' = 'right',
        text: string,
        width: number,
        chlk?: ChalkFunction
    ): string {
        let _text = '';
        if (align === 'center') {
            _text = text
                .padStart(text.length + Math.floor((width - text.length) / 2), this.FILL_STR)
                .padEnd(width, this.FILL_STR);
        }

        if (align === 'left') {
            _text = text.padEnd(width, this.FILL_STR);
        }

        if (align === 'right') {
            _text = text.padStart(width, this.FILL_STR);
        }
        return chlk ? chlk(_text) : _text;
    }

    private centerText(text: string, width: number, chlk?: ChalkFunction) {
        let _text = this.alignText('center', text, width, chlk);
        return _text;
    }

    private leftText(text: string, width: number, chlk?: ChalkFunction) {
        return this.alignText('left', text, width, chlk);
    }

    private rightText(text: string, width: number, chlk?: ChalkFunction) {
        return this.alignText('right', text, width, chlk);
    }
}
