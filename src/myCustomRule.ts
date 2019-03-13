import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING = 'Use of debugger statements is forbidden.';

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

        ctx.addFailureAtNode(node, 'Make a test bitch');
    }

}

function isSourceFile(node: ts.Node): node is ts.SourceFile {
    return (node.kind === ts.SyntaxKind.SourceFile);
}
