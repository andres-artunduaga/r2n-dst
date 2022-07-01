import { Tabulator } from '../utils/tabulator';

type HelpItem = {
    options: string;
    description?: string;
};

function getHelpItems(): HelpItem[] {
    return [
        {
            options: '-g,--generate',
            description: 'Generate DST file',
        },
        {
            options: '-h,--help',
            description: 'Display this information',
        },
        {
            options: '-t,--theme',
            description: 'Select theme',
        },
    ];
}

function showHelp() {
    let items: HelpItem[] = getHelpItems();
    let table = new Tabulator(items);
    table.print();
}

export { showHelp };
