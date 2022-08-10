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
            usage: "r2ndst --init"
        },
        {
            options: '--destination',
            description: 'Place where the files are gonna be created',
            usage: "r2ndst --init --destination ./awesome-dst-folder"
        },
        {
            options: '--schema',
            description: 'Creates a copy of the schema that can be modified',
            usage: "r2ndst --schema"
        },
        {
            options: '--help',
            description: 'Display this information',
            usage: "r2ndst --help"
        },
        {
            options: '--theme',
            description: 'Add themes',
            usage: "r2ndst --theme default"
        },
        {
            options: '--toJson',
            description: 'generates a JSON file with the token definitions',
            usage: "r2ndst --toJson --source ./awesomefile.dst.json --destination ./"
        },
        {
            options: '--source',
            description: 'indicates the source dst file',
            usage: "r2ndst --toJson --source ./awesomefile.dst.json --destination ./"
        },
        {
            options: '--filename',
            description: 'Set the file name',
            usage: "r2ndst --toJson --source ./awesomefile.dst.json --destination ./ --filename awesomefile"
        }
    ];
}

function showHelp() {
    let items: HelpItem[] = getHelpItems();
    let table = new Tabulator(items);
    table.print();
}

export { showHelp, getHelpItems };
