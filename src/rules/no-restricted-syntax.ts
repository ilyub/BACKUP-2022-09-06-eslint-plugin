import * as utils from "./utils";
import { a, createValidationObject, evaluate, is, o } from "@skylib/functions";
import * as ts from "typescript";
import type { strings } from "@skylib/functions";
import type { TSESTree } from "@typescript-eslint/utils";

export const noRestrictedSyntax = utils.createRule({
  create: context => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Postponed
    const listener = getVisitors();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Postponed
    return context.defineTemplateBodyVisitor(listener, listener);

    function checkType(type: ts.Type, ...flags: ts.TypeFlags[]): boolean {
      if (type.isTypeParameter()) {
        const constraint = type.getConstraint();

        if (is.not.empty(constraint)) type = constraint;
        else return flags.includes(ts.TypeFlags.Unknown);
      }

      return (
        flags.includes(type.getFlags()) ||
        (type.isUnion() &&
          type.types.every(subtype => flags.includes(subtype.getFlags())))
      );
    }

    function checkTypeHas(type: ts.Type, expected?: Type): boolean {
      return expected
        ? checkTypeIs(type, expected) ||
            (type.isUnion() &&
              type.types.some(subtype => checkTypeIs(subtype, expected)))
        : true;
    }

    function checkTypeHasNoneOf(type: ts.Type, expected?: Types): boolean {
      return expected ? expected.every(x => checkTypeHasNot(type, x)) : true;
    }

    function checkTypeHasNot(type: ts.Type, expected?: Type): boolean {
      return expected ? !checkTypeHas(type, expected) : true;
    }

    function checkTypeHasOneOf(type: ts.Type, expected?: Types): boolean {
      return expected ? expected.some(x => checkTypeHas(type, x)) : true;
    }

    function checkTypeIs(type: ts.Type, expected?: Type): boolean {
      if (expected)
        switch (expected) {
          case "any":
            return checkType(type, ts.TypeFlags.Any);

          case "array":
            return (
              checkType(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
              isArray()
            );

          case "boolean":
            return checkType(
              type,
              ts.TypeFlags.Boolean,
              ts.TypeFlags.BooleanLike,
              ts.TypeFlags.BooleanLiteral
            );

          case "null":
            return checkType(type, ts.TypeFlags.Null);

          case "number":
            return checkType(
              type,
              ts.TypeFlags.Number,
              ts.TypeFlags.NumberLike,
              ts.TypeFlags.NumberLiteral
            );

          case "function":
            return (
              checkType(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
              isFunction()
            );

          case "object":
            return (
              checkType(type, ts.TypeFlags.NonPrimitive, ts.TypeFlags.Object) &&
              isObject()
            );

          case "string":
            return checkType(
              type,
              ts.TypeFlags.String,
              ts.TypeFlags.StringLike,
              ts.TypeFlags.StringLiteral
            );

          case "symbol":
            return checkType(
              type,
              ts.TypeFlags.ESSymbol,
              ts.TypeFlags.ESSymbolLike,
              ts.TypeFlags.UniqueESSymbol
            );

          case "undefined":
            return checkType(type, ts.TypeFlags.Undefined);

          case "unknown":
            return checkType(type, ts.TypeFlags.Unknown);
        }

      return true;

      function isArray(): boolean {
        return context.checker.isArrayType(type);
      }

      function isFunction(): boolean {
        return type.getCallSignatures().length > 0;
      }

      function isObject(): boolean {
        return !isArray() && !isFunction();
      }
    }

    function checkTypeIsNoneOf(type: ts.Type, expected?: Types): boolean {
      return expected ? expected.every(x => checkTypeIsNot(type, x)) : true;
    }

    function checkTypeIsNot(type: ts.Type, expected?: Type): boolean {
      return expected ? !checkTypeIs(type, expected) : true;
    }

    function checkTypeIsOneOf(type: ts.Type, expected?: Types): boolean {
      return expected ? expected.some(x => checkTypeIs(type, x)) : true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Postponed
    function getVisitors(): any {
      return o.fromEntries(
        context.subOptionsArray.map(subOptions => {
          const {
            _id,
            message,
            replacement,
            search,
            selector: mixed,
            typeHas,
            typeHasNoneOf,
            typeHasNot,
            typeHasOneOf,
            typeIs,
            typeIsNoneOf,
            typeIsNot,
            typeIsOneOf
          } = subOptions;

          const selector = a.fromMixed(mixed).join(", ");

          return [
            selector,
            (node: TSESTree.Node): void => {
              const tsNode = context.toTsNode(node);

              const type = context.checker.getTypeAtLocation(tsNode);

              if (
                checkTypeIs(type, typeIs) &&
                checkTypeHasNot(type, typeHasNot) &&
                checkTypeIsNot(type, typeIsNot) &&
                checkTypeHas(type, typeHas) &&
                checkTypeHasNoneOf(type, typeHasNoneOf) &&
                checkTypeHasOneOf(type, typeHasOneOf) &&
                checkTypeIsNoneOf(type, typeIsNoneOf) &&
                checkTypeIsOneOf(type, typeIsOneOf)
              )
                context.report({
                  data: {
                    _id,
                    message:
                      message ?? `This syntax is not allowed: ${selector}`
                  },
                  fix: () =>
                    is.not.empty(replacement)
                      ? [
                          {
                            range: node.range,
                            text: is.not.empty(search)
                              ? context.getText(node).replace(
                                  // eslint-disable-next-line security/detect-non-literal-regexp -- Ok
                                  new RegExp(search, "u"),
                                  replacement
                                )
                              : replacement
                          }
                        ]
                      : [],
                  loc: context.getLocFromRange(node.range),
                  messageId: "customMessage"
                });
            }
          ];
        })
      );
    }
  },
  fixable: "code",
  isRuleOptions: is.object,
  isSubOptions: evaluate(() => {
    const TypeVO = createValidationObject<Type>({
      any: "any",
      array: "array",
      boolean: "boolean",
      function: "function",
      null: "null",
      number: "number",
      object: "object",
      string: "string",
      symbol: "symbol",
      undefined: "undefined",
      unknown: "unknown"
    });

    const isType = is.factory(is.enumeration, TypeVO);

    const isTypes = is.factory(is.array.of, isType);

    return is.object.factory<SubOptions>(
      { _id: is.string, selector: is.or.factory(is.string, is.strings) },
      {
        message: is.string,
        replacement: is.string,
        search: is.string,
        typeHas: isType,
        typeHasNoneOf: isTypes,
        typeHasNot: isType,
        typeHasOneOf: isTypes,
        typeIs: isType,
        typeIsNoneOf: isTypes,
        typeIsNot: isType,
        typeIsOneOf: isTypes
      }
    );

    interface SubOptions {
      readonly _id: string;
      readonly message?: string;
      readonly replacement?: string;
      readonly search?: string;
      readonly selector: strings | string;
      readonly typeHas?: Type;
      readonly typeHasNoneOf?: Types;
      readonly typeHasNot?: Type;
      readonly typeHasOneOf?: Types;
      readonly typeIs?: Type;
      readonly typeIsNoneOf?: Types;
      readonly typeIsNot?: Type;
      readonly typeIsOneOf?: Types;
    }
  }),
  messages: { customMessage: "{{ message }} ({{ _id }})" },
  name: "no-restricted-syntax"
});

type Type =
  | "any"
  | "array"
  | "boolean"
  | "function"
  | "null"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined"
  | "unknown";

type Types = readonly Type[];
