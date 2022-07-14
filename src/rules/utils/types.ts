import type * as estree from "estree";
import type * as ts from "typescript";
import type { ParserServices, TSESTree } from "@typescript-eslint/utils";
import type {
  ReportDescriptor,
  RuleContext,
  RuleFix,
  RuleListener,
  SourceCode
} from "@typescript-eslint/utils/dist/ts-eslint";
import type { s, unknowns } from "@skylib/functions";
import type { TypeCheck } from "./TypeCheck";
import { is } from "@skylib/functions";

export enum Fixable {
  code = "code",
  whitespace = "whitespace"
}

export enum TypeGroup {
  any = "any",
  array = "array",
  boolean = "boolean",
  complex = "complex",
  function = "function",
  null = "null",
  number = "number",
  object = "object",
  readonly = "readonly",
  string = "string",
  symbol = "symbol",
  tuple = "tuple",
  // eslint-disable-next-line @typescript-eslint/no-shadow -- Wait for https://github.com/typescript-eslint/typescript-eslint/issues/5337
  undefined = "undefined",
  unknown = "unknown"
}

export const isTypeGroup = is.factory(is.enumeration, TypeGroup);

export const isTypeGroups = is.factory(is.array.of, isTypeGroup);

export interface Context<M extends string, O extends object, S extends object> {
  readonly checker: ts.TypeChecker;
  readonly code: string;
  readonly defineTemplateBodyVisitor: DefineTemplateBodyVisitor;
  readonly eol: s.Eol;
  /**
   * Gets leading trivia.
   *
   * @param node - Node.
   * @returns Leading trivia.
   */
  readonly getLeadingTrivia: (node: TSESTree.Node) => string;
  /**
   * Gets location from range.
   *
   * @param range - Range.
   * @returns Location.
   */
  readonly getLocFromRange: (range: ReadonlyRange) => estree.SourceLocation;
  /**
   * Gets member name.
   *
   * @param node - Node.
   * @param context - Context.
   * @returns Member name.
   */
  readonly getMemberName: (
    node: TSESTree.ClassElement | TSESTree.TypeElement
  ) => string;
  /**
   * Gets range with leading trivia.
   *
   * @param node - Node.
   * @returns Range.
   */
  readonly getRangeWithLeadingTrivia: (node: TSESTree.Node) => TSESTree.Range;
  /**
   * Gets text.
   *
   * @param node - Node.
   * @returns Text.
   */
  readonly getText: (node: TSESTree.Comment | TSESTree.Node) => string;
  /**
   * Gets text with leading trivia.
   *
   * @param node - Node.
   * @returns Text.
   */
  readonly getTextWithLeadingTrivia: (node: TSESTree.Node) => string;
  /**
   * Checks if node has leading doc comment.
   *
   * @param node - Node.
   * @returns _True_ if node has leading doc comment, _false_ otherwise.
   */
  readonly hasLeadingDocComment: (node: TSESTree.Node) => boolean;
  /**
   * Checks if node has trailing comment.
   *
   * @param node - Node.
   * @returns _True_ if node has trailing comment, _false_ otherwise.
   */
  readonly hasTrailingComment: (node: TSESTree.Node) => boolean;
  readonly id: string;
  readonly locZero: TSESTree.SourceLocation;
  /**
   * Checks if signature or symbol is missing doc comment.
   *
   * @param mixed - Signature or symbol.
   * @returns _True_ if signature or symbol is missing doc comment, _false_ otherwise.
   */
  readonly missingDocComment: (mixed: ts.Signature | ts.Symbol) => boolean;
  readonly options: O;
  readonly package: Package;
  readonly path: string;
  /**
   * Reports error.
   *
   * @param descriptor - Descriptor.
   */
  readonly report: (descriptor: ReportDescriptor<M>) => void;
  readonly scope: ReturnType<RuleContext<M, unknowns>["getScope"]>;
  readonly source: SourceCode;
  readonly subOptionsArray: readonly S[];
  readonly toEsNode: ParserServices["tsNodeToESTreeNodeMap"]["get"];
  readonly toTsNode: ParserServices["esTreeNodeToTSNodeMap"]["get"];
  readonly typeCheck: TypeCheck;
}

// eslint-disable-next-line @skylib/require-jsdoc -- Postponed
export interface DefineTemplateBodyVisitor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Postponed
  (templateVisitor: any, scriptVisitor?: any, options?: any): RuleListener;
}

export interface Package {
  readonly name?: string;
}

export type ReadonlyRange = readonly [number, number];

export type RuleFixes = readonly RuleFix[];

export type TypeGroups = readonly TypeGroup[];
