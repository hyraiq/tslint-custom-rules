import * as fs from 'fs';
import * as path from 'path';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {

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
                exclude: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
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

    public static makeErrorString(expectedPath: string) {
        return `Test case for file not found in ${expectedPath}`;
    }
}

interface IRuleOptions {
    srcBase: string;
    testBase: string;
    exclude: string[];
}

function walk(ctx: Lint.WalkContext<IRuleOptions>) {
    const relativePath = path.relative(process.cwd(), ctx.sourceFile.fileName).replace(ctx.options.srcBase, '');
    const basename = relativePath.replace(path.parse(relativePath).ext, '');

    if (isExcluded(relativePath, ctx.options.exclude)) {
        return;
    }

    const testFile = `${path.join(ctx.options.testBase, basename)}.spec.js`;
    if (!fs.existsSync(testFile)) {
        ctx.addFailureAtNode(ctx.sourceFile, Rule.makeErrorString(testFile));
    }
}

function isExcluded(filePath: string, excludePatterns: string[]) {
    for (const excludePattern of excludePatterns) {
        const regex = new RegExp(excludePattern);
        const result = filePath.match(regex);

        if (null !== result && 0 !== result.length) {
            return true;
        }
    }

    return false;
}
