import * as fs from 'fs';
import * as path from 'path';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Missing test case';

    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'no-missing-tests',
        description: 'Ensure that all ts files have a test',
        optionsDescription:
            'A list of method names to ban. If no method names are provided, all console methods are banned.',
        options: {
            type: 'object',
            properties: {
                srcBase: {
                    type: 'string',
                },
                testBase: {
                    type: 'string',
                },
            },
        },
        optionExamples: [[true, 'log', 'error']],
        type: 'functionality',
        typescriptOnly: false,
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments[0]);
    }
}

interface IRuleOptions {
    srcBase: string;
    testBase: string;
}

function walk(ctx: Lint.WalkContext<IRuleOptions>) {
    const relativePath = path.relative(process.cwd(), ctx.sourceFile.fileName).replace(ctx.options.srcBase, '');
    const basename = relativePath.replace(path.parse(relativePath).ext, '');
    const testFile = `${path.join(ctx.options.testBase, basename)}.spec.js`;
    if (!fs.existsSync(testFile)) {
        ctx.addFailureAtNode(ctx.sourceFile, Rule.FAILURE_STRING);
    }
}
