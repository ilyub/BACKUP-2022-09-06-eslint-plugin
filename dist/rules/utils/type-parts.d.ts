import type { NumStrU } from "@skylib/functions/dist/types/core";
import type { TSESTree } from "@typescript-eslint/utils";
import * as ts from "typescript";
import type * as utils from ".";
/**
 * Gets type parts.
 *
 * @param node - Node.
 * @param context - Context.
 * @returns Type parts.
 */
export declare const getTypeParts: {
    /**
     * Gets type parts.
     *
     * @param node - Node.
     * @param context - Context.
     * @returns Type parts.
     */
    typeofFix<M extends string, O extends object, S extends object>(node: TSESTree.Node, context: utils.Context<M, O, S>): readonly TypePart[];
} & (<M_1 extends string, O_1 extends object, S_1 extends object>(node: TSESTree.Node, context: utils.Context<M_1, O_1, S_1>) => readonly TypePart[]);
export declare type TypePart = NumStrU | ts.Type;
//# sourceMappingURL=type-parts.d.ts.map