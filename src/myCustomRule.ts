import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Missing test case';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    ts.forEachChild(ctx.sourceFile, recur);

    function recur(node: ts.Node): void {
        if (!isSourceFile(node)) {
            return;
        }

        ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
    }
}

function isSourceFile(node: ts.Node): node is ts.SourceFile {
    return (node.kind === ts.SyntaxKind.SourceFile);
}
