import { Tabulator } from '../utils/tabulator';

export type HelpItem = {
    options: string;
    description?: string;
    usage?: string;
};

function getHelpItems(): HelpItem[] {
    return [
        {
            options: '--init',
            description: 'Generate empty DST file unless used with --theme',
        },
        {
            options: '--destination',
            description: 'Place where the files are gonna be created',
        },
        {
            options: '--schema',
            description: 'Creates a copy of the schema that can be modified',
        },
        {
            options: '--help',
            description: 'Display this information',
        },
        {
            options: '--theme',
            description: 'Add themes',
        }
    ];
}

function showHelp() {
    let items: HelpItem[] = getHelpItems();
    let table = new Tabulator(items);
    table.print();
}

export { showHelp, getHelpItems };
