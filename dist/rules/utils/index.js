"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRule = exports.stripBase = exports.getTypeNames = exports.getTypeName = exports.getSelectors = exports.getPackage = exports.getComments = exports.createRule = exports.createMatcher = exports.createFileMatcher = exports.base = exports.isPackage = void 0;
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const _ = (0, tslib_1.__importStar)(require("lodash"));
const minimatch_1 = (0, tslib_1.__importDefault)(require("minimatch"));
const tsutils = (0, tslib_1.__importStar)(require("tsutils"));
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const assert = (0, tslib_1.__importStar)(require("@skylib/functions/dist/assertions"));
const cast = (0, tslib_1.__importStar)(require("@skylib/functions/dist/converters"));
const fn = (0, tslib_1.__importStar)(require("@skylib/functions/dist/function"));
const is = (0, tslib_1.__importStar)(require("@skylib/functions/dist/guards"));
const json = (0, tslib_1.__importStar)(require("@skylib/functions/dist/json"));
const reflect = (0, tslib_1.__importStar)(require("@skylib/functions/dist/reflect"));
const s = (0, tslib_1.__importStar)(require("@skylib/functions/dist/string"));
exports.isPackage = is.factory(is.object.of, {}, { name: is.string });
exports.base = fn.pipe(process.cwd(), s.path.canonicalize, s.path.addTrailingSlash);
/**
 * Creates file matcher.
 *
 * @param patterns - Patterns.
 * @param defVal - Default value.
 * @param options - Minimatch options.
 * @returns Matcher.
 */
function createFileMatcher(patterns, defVal, options) {
    if (patterns.length) {
        const matchers = patterns.map(pattern => (str) => (0, minimatch_1.default)(str, pattern, options));
        return (str) => matchers.some(matcher => matcher(str));
    }
    return () => defVal;
}
exports.createFileMatcher = createFileMatcher;
/**
 * Creates file matcher.
 *
 * @param disallow - Disallow patterns.
 * @param allow - Allow patterns.
 * @param defVal - Default value.
 * @param options - Minimatch options.
 * @returns Matcher.
 */
createFileMatcher.disallowAllow = (disallow, allow, defVal, options) => {
    if (disallow.length || allow.length) {
        const disallowMatcher = createFileMatcher(disallow, true, options);
        const allowMatcher = createFileMatcher(allow, false, options);
        return (str) => disallowMatcher(str) && !allowMatcher(str);
    }
    return () => defVal;
};
/**
 * Creates matcher.
 *
 * @param patterns - RegExp patterns.
 * @returns Matcher.
 */
function createMatcher(patterns) {
    const matchers = patterns
        .map(str => new RegExp(str, "u"))
        .map(re => (str) => re.test(str));
    return (str) => matchers.some(matcher => matcher(str));
}
exports.createMatcher = createMatcher;
/**
 * Creates rule listenter.
 *
 * @param options - Options.
 * @returns Rule listenter.
 */
function createRule(options) {
    const { create, defaultOptions, fixable, messages } = options;
    const ruleCreator = experimental_utils_1.ESLintUtils.RuleCreator((ruleId) => `https://ilyub.github.io/eslint-plugin/#${ruleId}`);
    return ruleCreator({
        create(context, rawOptions) {
            const betterContext = createBetterContext(context, rawOptions, options);
            return shouldBeLinted(betterContext.options, betterContext.id, betterContext.path, betterContext.code)
                ? create(betterContext)
                : {};
        },
        defaultOptions: [defaultOptions !== null && defaultOptions !== void 0 ? defaultOptions : {}],
        meta: Object.assign({ docs: {
                description: "Rule",
                recommended: false,
                requiresTypeChecking: true
            }, messages, schema: [{}], type: "suggestion" }, (is.not.empty(fixable) ? { fixable } : {})),
        name: "Rule"
    });
}
exports.createRule = createRule;
/**
 * Gets program comments.
 *
 * @param program - Program.
 * @returns Comments.
 */
function getComments(program) {
    return cast.not.empty(program.comments, []);
}
exports.getComments = getComments;
/**
 * Parses package file.
 *
 * @param path - Path.
 * @returns Package file data.
 */
function getPackage(path = "package.json") {
    if (fs_1.default.existsSync(path)) {
        const result = json.decode(fs_1.default.readFileSync(path).toString());
        if ((0, exports.isPackage)(result))
            return result;
    }
    return {};
}
exports.getPackage = getPackage;
/**
 * Gets selectors as a string.
 *
 * @param options - Options.
 * @param defaultSelectors - Default selectors.
 * @returns Selectors as a string.
 */
function getSelectors(options, defaultSelectors) {
    const { excludeSelectors, includeSelectors, noDefaultSelectors } = options;
    const selectors = noDefaultSelectors
        ? includeSelectors
        : _.difference([...defaultSelectors, ...includeSelectors], excludeSelectors);
    assert.toBeTrue(selectors.length > 0, "Expecting at least one selector");
    return selectors.join(", ");
}
exports.getSelectors = getSelectors;
/**
 * Gets type name.
 *
 * @param type - Type.
 * @returns Type name.
 */
function getTypeName(type) {
    var _a, _b;
    return (_b = (_a = type.getSymbol()) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "?";
}
exports.getTypeName = getTypeName;
/**
 * Gets type names as a string.
 *
 * @param types - Types.
 * @returns Type names as a string.
 */
function getTypeNames(types) {
    return types.map(type => getTypeName(type)).join(" > ");
}
exports.getTypeNames = getTypeNames;
/**
 * Strips base path.
 *
 * @param path - Path.
 * @param replacement - Replacement.
 * @returns Stripped path.
 */
function stripBase(path, replacement = "") {
    assert.toBeTrue(s.path.canonicalize(path).startsWith(exports.base), `Expecting path to be inside project folder: ${path}`);
    return `${replacement}${path.slice(exports.base.length)}`;
}
exports.stripBase = stripBase;
/**
 * Runs test.
 *
 * @param name - Rule name.
 * @param rule - Rule.
 * @param invalid - Invalid tests.
 * @param valid - Valid tests.
 */
function testRule(name, rule, invalid, valid = []) {
    const tester = new experimental_utils_1.TSESLint.RuleTester({
        parser: require.resolve("@typescript-eslint/parser"),
        parserOptions: {
            ecmaVersion: 2017,
            project: "./tsconfig.json",
            sourceType: "module",
            tsconfigRootDir: `${exports.base}fixtures`
        }
    });
    const filename = `${exports.base}/fixtures/file.ts`;
    tester.run(name, rule, {
        invalid: invalid.map(invalidTest => {
            var _a;
            const code = s.unpadMultiline(invalidTest.code);
            const output = s.unpadMultiline((_a = invalidTest.output) !== null && _a !== void 0 ? _a : invalidTest.code);
            return Object.assign(Object.assign({}, invalidTest), { code, filename, output });
        }),
        valid: valid.map(validTest => {
            const code = s.unpadMultiline(validTest.code);
            return Object.assign(Object.assign({}, validTest), { code, filename });
        })
    });
}
exports.testRule = testRule;
const isSharedOptions = is.factory(is.object.of, {}, { filesToLint: is.strings, filesToSkip: is.strings, subOptionsId: is.string });
/**
 * Gets rule options.
 *
 * @param ruleOptionsArray - Raw rule options array.
 * @param options - Options.
 * @returns Rule options.
 */
function getRuleOptions(ruleOptionsArray, options) {
    const { isRuleOptions } = options;
    const ruleOptions = ruleOptionsArray[0];
    assert.byGuard(ruleOptions, isRuleOptions, "Expecting valid rule options");
    return ruleOptions;
}
/**
 * Gets suboptions array.
 *
 * @param ruleOptionsArray - Raw rule options array.
 * @param options - Options.
 * @param ruleId - Rule id.
 * @param path - Path.
 * @param code - Code.
 * @returns Suboptions array.
 */
function getSubOptionsArray(ruleOptionsArray, options, ruleId, path, code) {
    var _a;
    const { defaultSubOptions, isSubOptions, subOptionsKey } = options;
    if (isSubOptions) {
        const ruleOptions = getRuleOptions(ruleOptionsArray, options);
        const raw = (_a = reflect.get(ruleOptions, subOptionsKey !== null && subOptionsKey !== void 0 ? subOptionsKey : "rules")) !== null && _a !== void 0 ? _a : [];
        assert.array.of(raw, is.object, "Expecting valid rule options");
        const result = raw
            .map(subOptions => {
            return Object.assign(Object.assign({}, defaultSubOptions), subOptions);
        })
            .filter(subOptions => shouldBeLinted(subOptions, ruleId, path, code));
        assert.array.of(result, isSubOptions, "Expecting valid rule options");
        return result;
    }
    return [];
}
/**
 * Creates better context.
 *
 * @param context - Context.
 * @param ruleOptionsArray - Raw rule options array.
 * @param options - Options.
 * @returns Better context.
 */
function createBetterContext(context, ruleOptionsArray, options) {
    const id = context.id;
    const path = context.getFilename();
    const source = context.getSourceCode();
    const code = source.getText();
    const parser = experimental_utils_1.ESLintUtils.getParserServices(context);
    assert.toBeTrue(tsutils.isStrictCompilerOptionEnabled(parser.program.getCompilerOptions(), "strictNullChecks"), 'Expecting "strictNullChecks" compiler option to be enabled');
    return {
        checker: parser.program.getTypeChecker(),
        code,
        eol: s.detectEol(code),
        getLeadingTrivia(node) {
            const tsNode = this.toTsNode(node);
            return code.slice(node.range[0] - tsNode.getLeadingTriviaWidth(), node.range[0]);
        },
        getLocFromRange(range) {
            return {
                end: source.getLocFromIndex(range[1]),
                start: source.getLocFromIndex(range[0])
            };
        },
        getRangeWithLeadingTrivia(node) {
            return [
                node.range[0] - this.getLeadingTrivia(node).length,
                node.range[1]
            ];
        },
        getText(node) {
            return code.slice(...node.range);
        },
        getTextWithLeadingTrivia(node) {
            return code.slice(node.range[0] - this.getLeadingTrivia(node).length, node.range[1]);
        },
        getTypeDefinitions(types) {
            return types.map(type => this.checker.typeToString(type)).join(" > ");
        },
        hasLeadingDocComment(node) {
            return this.getLeadingTrivia(node).trim().startsWith("/**");
        },
        id,
        locZero: source.getLocFromIndex(0),
        missingDocComment(mixed) {
            return mixed.getDocumentationComment(this.checker).length === 0;
        },
        options: getRuleOptions(ruleOptionsArray, options),
        package: getPackage(),
        path,
        report: context.report.bind(context),
        scope: context.getScope(),
        source,
        subOptionsArray: getSubOptionsArray(ruleOptionsArray, options, id, path, code),
        toEsNode: parser.tsNodeToESTreeNodeMap.get.bind(parser.tsNodeToESTreeNodeMap),
        toTsNode: parser.esTreeNodeToTSNodeMap.get.bind(parser.esTreeNodeToTSNodeMap)
    };
}
/**
 * Determines if file should be linted.
 *
 * @param options - Options.
 * @param ruleId - Rule id.
 * @param path - Path.
 * @param code - Code.
 * @returns _True_ if file should be linted, _false_ otherwise.
 */
function shouldBeLinted(options, ruleId, path, code) {
    assert.byGuard(options, isSharedOptions, "Expecting valid rule options");
    const disallowById = is.not.empty(options.subOptionsId) &&
        code.includes(`/* skylib/eslint-plugin disable ${ruleId}[${options.subOptionsId}] */`);
    const disallowByPath = fn.run(() => {
        var _a, _b;
        const matcher = createFileMatcher.disallowAllow((_a = options.filesToSkip) !== null && _a !== void 0 ? _a : [], (_b = options.filesToLint) !== null && _b !== void 0 ? _b : [], false, { dot: true, matchBase: true });
        return matcher(stripBase(s.path.canonicalize(path), "./"));
    });
    return !disallowByPath && !disallowById;
}
//# sourceMappingURL=index.js.map