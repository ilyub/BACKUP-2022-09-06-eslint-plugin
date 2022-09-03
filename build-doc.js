const { evaluate, o, s } = require("@skylib/functions");

const fs = require("node:fs");

const { rules } =
  // eslint-disable-next-line @skylib/no-internal-modules -- Ok
  require("./dist/rules.core.js");

const templates = {
  config: fs.readFileSync("./docs-templates/config.md").toString().trim(),
  configOptions: fs
    .readFileSync("./docs-templates/config-options.md")
    .toString()
    .trim(),
  configOptionsSuboptions: fs
    .readFileSync("./docs-templates/config-options-suboptions.md")
    .toString()
    .trim(),
  configSuboptions: fs
    .readFileSync("./docs-templates/config-suboptions.md")
    .toString()
    .trim(),
  index: fs.readFileSync("./docs-templates/index.md").toString().trim(),
  rule: fs.readFileSync("./docs-templates/rule.md").toString().trim()
};

const documentedRules = o.sort(
  // eslint-disable-next-line no-warning-comments -- Wait for @skylib/functions update
  // fixme - Use o.pick
  o.filter(
    rules,
    (_rule, name) =>
      !(
        name.startsWith("config/") ||
        name.startsWith("facades/") ||
        name.startsWith("framework/") ||
        name.startsWith("functions/") ||
        name.startsWith("quasar-extension/")
      )
  ),
  (_value1, _value2, key1, key2) => {
    if (key1.includes("/") && !key2.includes("/")) return 1;

    if (key2.includes("/") && !key1.includes("/")) return -1;

    return key1.localeCompare(key2);
  }
);

{
  const index = templates.index.replace(
    "{{rules}}",
    o
      .keys(documentedRules)
      .map(
        name =>
          `- [${name}](https://ilyub.github.io/eslint-plugin/${name}.html)`
      )
      .join("\n")
  );

  fs.writeFileSync("./README.md", index);
  fs.writeFileSync("./docs/index.md", index);
}

{
  fs.mkdirSync("./docs/eslintrc");
  fs.mkdirSync("./docs/jest");
  fs.mkdirSync("./docs/typescript");
  fs.mkdirSync("./docs/vue");

  for (const [name, rule] of o.entries(documentedRules)) {
    const {
      description,
      failExamples,
      optionDescriptions,
      optionTypes,
      passExamples,
      suboptionDescriptions,
      suboptionTypes,
      suboptionsKey
    } = rule.meta.docs;

    const options = optionTypes
      ? o
          .entries(optionTypes)
          .map(([option, type]) => `${option}: ${type}`)
          .join(",\n        ")
      : "";

    const optionsAnnotation = optionDescriptions
      ? o
          .entries(optionDescriptions)
          .map(([option, description]) => `| ${option} | ${description} |`)
          .join("\n")
      : "";

    const suboptions = suboptionTypes
      ? o
          .entries(suboptionTypes)
          .map(([option, type]) => `${option}: ${type}`)
          .join(",\n            ")
      : "";

    const suboptionsAnnotation = suboptionDescriptions
      ? o
          .entries(suboptionDescriptions)
          .map(
            ([option, description]) => `| rules.${option} | ${description} |`
          )
          .join("\n")
      : "";

    const config = evaluate(() => {
      if (options)
        return suboptions
          ? templates.configOptionsSuboptions
          : templates.configOptions;

      return suboptions ? templates.configSuboptions : templates.config;
    })
      .replace("{{key}}", suboptionsKey)
      .replace("{{options}}", options)
      .replace("{{options-annotation}}", optionsAnnotation)
      .replace("{{suboptions}}", suboptions)
      .replace("{{suboptions-annotation}}", suboptionsAnnotation);

    fs.writeFileSync(
      `./docs/${name}.md`,
      // eslint-disable-next-line no-warning-comments -- Wait for @skylib/functions update
      // fixme: Use s.strtr
      s.replaceAll(
        templates.rule
          .replace("{{description}}", description)
          .replace("{{fail-examples}}", failExamples)
          .replace("{{pass-examples}}", passExamples)
          .replace("{{config}}", config)
          .replace("{{options}}", options),
        "{{name}}",
        name
      )
    );
  }
}
