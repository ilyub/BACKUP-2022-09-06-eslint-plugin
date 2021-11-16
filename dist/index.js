"use strict";
const tslib_1 = require("tslib");
const class_member_typedef_1 = (0, tslib_1.__importDefault)(require("./rules/class-member-typedef"));
const consistent_empty_lines_1 = (0, tslib_1.__importDefault)(require("./rules/consistent-empty-lines"));
const consistent_import_1 = (0, tslib_1.__importDefault)(require("./rules/consistent-import"));
const disallow_by_regexp_1 = (0, tslib_1.__importDefault)(require("./rules/disallow-by-regexp"));
const disallow_identifier_1 = (0, tslib_1.__importDefault)(require("./rules/disallow-identifier"));
const disallow_import_1 = (0, tslib_1.__importDefault)(require("./rules/disallow-import"));
const empty_lines_around_comment_1 = (0, tslib_1.__importDefault)(require("./rules/empty-lines-around-comment"));
const exhaustive_switch_1 = (0, tslib_1.__importDefault)(require("./rules/exhaustive-switch"));
const no_inferrable_types_1 = (0, tslib_1.__importDefault)(require("./rules/no-inferrable-types"));
const no_mutable_signature_1 = (0, tslib_1.__importDefault)(require("./rules/no-mutable-signature"));
const no_unnecessary_readonly_1 = (0, tslib_1.__importDefault)(require("./rules/no-unnecessary-readonly"));
const no_unnecessary_writable_1 = (0, tslib_1.__importDefault)(require("./rules/no-unnecessary-writable"));
const no_unsafe_object_assignment_1 = (0, tslib_1.__importDefault)(require("./rules/no-unsafe-object-assignment"));
const no_unused_import_1 = (0, tslib_1.__importDefault)(require("./rules/no-unused-import"));
const prefer_readonly_1 = (0, tslib_1.__importDefault)(require("./rules/prefer-readonly"));
const require_jsdoc_1 = (0, tslib_1.__importDefault)(require("./rules/require-jsdoc"));
const sort_class_members_1 = (0, tslib_1.__importDefault)(require("./rules/sort-class-members"));
const template_literal_format_1 = (0, tslib_1.__importDefault)(require("./rules/template-literal-format"));
module.exports = {
    rules: {
        "class-member-typedef": class_member_typedef_1.default,
        "consistent-empty-lines": consistent_empty_lines_1.default,
        "consistent-import": consistent_import_1.default,
        "disallow-by-regexp": disallow_by_regexp_1.default,
        "disallow-identifier": disallow_identifier_1.default,
        "disallow-import": disallow_import_1.default,
        "empty-lines-around-comment": empty_lines_around_comment_1.default,
        "exhaustive-switch": exhaustive_switch_1.default,
        "no-inferrable-types": no_inferrable_types_1.default,
        "no-mutable-signature": no_mutable_signature_1.default,
        "no-unnecessary-readonly": no_unnecessary_readonly_1.default,
        "no-unnecessary-writable": no_unnecessary_writable_1.default,
        "no-unsafe-object-assignment": no_unsafe_object_assignment_1.default,
        "no-unused-import": no_unused_import_1.default,
        "prefer-readonly": prefer_readonly_1.default,
        "require-jsdoc": require_jsdoc_1.default,
        "sort-class-members": sort_class_members_1.default,
        "template-literal-format": template_literal_format_1.default
    }
};
//# sourceMappingURL=index.js.map