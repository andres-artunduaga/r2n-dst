// You can use https://ts-ast-viewer.com/ to see how the AST tree should be constructed
import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Logger } from '../utils/logger';

// DST files are json files that uses string keys and values
type DSTObj = { [k: string]: DSTObj | DSTVal };
type DSTVal = string;

export class DSTToTypescript {
    private rawDstFile: any;
    private log: Logger = new Logger();
    private destination: string;
    private filename: string;
    private DEFAULT_FILE_NAME = 'dst.const.ts';
    private tsSourceFile: ts.SourceFile = ts.createSourceFile(
        this.DEFAULT_FILE_NAME,
        '',
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TS
    );

    constructor(source: string, destination: string, filename: string) {
        this.destination = destination;
        this.filename = filename;
        if (this.filename) {
            this.tsSourceFile.fileName = this.filename;
        }
        try {
            this.rawDstFile = this.getRawDstFile(source);
        } catch (error) {
            if (error instanceof Error) {
                this.log.error('Error while initializing class DSTTypescript: ', error.message);
            } else {
                console.error(error);
            }
        }
    }

    getRawDstFile(sourcePath: string): any {
        let PATH = path.resolve(sourcePath);
        if (fs.existsSync(PATH)) {
            return require(PATH);
        }
    }

    private createASTString(str: string): ts.StringLiteral {
        return ts.factory.createStringLiteral(str, true);
    }

    private createASTProperty(key: string, value: DSTObj | DSTVal): ts.PropertyAssignment {
        let valueLiteral: ts.ObjectLiteralExpression | ts.StringLiteral;
        let keyLiteral: ts.Identifier | ts.StringLiteral;

        switch (typeof value) {
            case 'object':
                valueLiteral = this.createASTObject(value);
                break;
            case 'string':
                valueLiteral = this.createASTString(value);
                break;
        }

        if (key.includes('-')) {
            keyLiteral = ts.factory.createStringLiteral(key, true);
        } else {
            keyLiteral = ts.factory.createIdentifier(key);
        }

        return ts.factory.createPropertyAssignment(keyLiteral, valueLiteral);
    }

    private createASTObject(obj: DSTObj): ts.ObjectLiteralExpression {
        const properties: ts.ObjectLiteralElementLike[] = [];
        for (const key in obj) {
            properties.push(this.createASTProperty(key, obj[key]));
        }
        // Add true as second parameter to use multiline
        return ts.factory.createObjectLiteralExpression(properties, true);
    }

    private createExportConstant(
        varName: ts.Identifier,
        varValue: ts.ObjectLiteralExpression
    ): ts.VariableStatement {
        const varDeclarationList = ts.factory.createVariableDeclarationList(
            [ts.factory.createVariableDeclaration(varName, undefined, undefined, varValue)],
            ts.NodeFlags.Const // This variable will be a constant
        );
        return ts.factory.createVariableStatement(
            [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)], // Adding export
            varDeclarationList
        );
    }

    private createNode(obj: DSTObj): ts.Node {
        const constName = ts.factory.createIdentifier('dst');
        const tsObj = this.createASTObject(this.rawDstFile);
        return this.createExportConstant(constName, tsObj);
    }

    private generateTsCode(): string {
        const node: ts.Node = this.createNode(this.rawDstFile);
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        return printer.printNode(ts.EmitHint.Unspecified, node, this.tsSourceFile);
    }

    private generateJsCode(): string {
        return ts.transpile(this.generateTsCode(), {
            target: ts.ScriptTarget.ES2020
        });
    }

    private createTsFile(): void {
        const code: string = this.generateTsCode();
        const filePath = `${this.destination}/${this.tsSourceFile.fileName}`;
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, code);
        } else {
            this.log.warn(`File [${filePath}] already exists`);
        }
    }

    toTs() {
        const code: string = this.generateTsCode();
        const filePath = `${this.destination}/${this.tsSourceFile.fileName}`;
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, code);
        } else {
            this.log.warn(`File [${filePath}] already exists`);
        }
    }

    toJs() {
        const code: string = this.generateJsCode();
        const filePath = `${this.destination}/${this.tsSourceFile.fileName}`.replace('.ts', '.js');
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, code);
        } else {
            this.log.warn(`File [${filePath}] already exists`);
        }
    }
}

export default DSTToTypescript;
