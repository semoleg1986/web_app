#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function toKebabCase(value) {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s/]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function toPascalCase(value) {
  return toKebabCase(value)
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function normalizePageRoute(value) {
  return value
    .trim()
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      if (/^\[[^\]]+\]$/.test(segment)) {
        return segment;
      }

      return toKebabCase(segment);
    })
    .join("/");
}

function ensureDir(dirPath, dryRun) {
  if (dryRun) {
    console.log(`[dry-run] mkdir -p ${dirPath}`);
    return;
  }

  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileSafe(filePath, content, dryRun) {
  if (fs.existsSync(filePath)) {
    fail(`Refusing to overwrite existing file: ${filePath}`);
  }

  if (dryRun) {
    console.log(`[dry-run] write ${filePath}`);
    return;
  }

  fs.writeFileSync(filePath, content, "utf8");
}

function createFeatureSlice({ appDir, sliceName, dryRun }) {
  const featureDir = path.join(appDir, "src", "features", sliceName);
  const modelDir = path.join(featureDir, "model");
  const uiDir = path.join(featureDir, "ui");

  const pascalName = toPascalCase(sliceName);
  const composableName = `use${pascalName}`;
  const componentName = `${pascalName}Section`;

  ensureDir(modelDir, dryRun);
  ensureDir(uiDir, dryRun);

  writeFileSafe(
    path.join(modelDir, `${composableName}.ts`),
    `export function ${composableName}() {
  return {};
}
`,
    dryRun
  );

  writeFileSafe(
    path.join(uiDir, `${componentName}.vue`),
    `<template>
  <section class="${sliceName}">
    <h2>${pascalName} section</h2>
  </section>
</template>

<script setup lang="ts">
import { ${composableName} } from "~/features/${sliceName}/model/${composableName}";

${composableName}();
</script>

<style scoped>
.${sliceName} {
  display: block;
}
</style>
`,
    dryRun
  );

  writeFileSafe(
    path.join(featureDir, "index.ts"),
    `export { ${composableName} } from "~/features/${sliceName}/model/${composableName}";
export { default as ${componentName} } from "~/features/${sliceName}/ui/${componentName}.vue";
`,
    dryRun
  );
}

function createWidgetSlice({ appDir, sliceName, dryRun }) {
  const widgetDir = path.join(appDir, "src", "widgets", sliceName);
  const modelDir = path.join(widgetDir, "model");
  const uiDir = path.join(widgetDir, "ui");

  const pascalName = toPascalCase(sliceName);
  const composableName = `use${pascalName}`;
  const componentName = `${pascalName}Widget`;

  ensureDir(modelDir, dryRun);
  ensureDir(uiDir, dryRun);

  writeFileSafe(
    path.join(modelDir, `${composableName}.ts`),
    `export function ${composableName}() {
  return {};
}
`,
    dryRun
  );

  writeFileSafe(
    path.join(uiDir, `${componentName}.vue`),
    `<template>
  <section class="${sliceName}">
    <h1>${pascalName} widget</h1>
  </section>
</template>

<script setup lang="ts">
import { ${composableName} } from "~/widgets/${sliceName}/model/${composableName}";

${composableName}();
</script>

<style scoped>
.${sliceName} {
  display: block;
}
</style>
`,
    dryRun
  );

  writeFileSafe(
    path.join(widgetDir, "index.ts"),
    `export { ${composableName} } from "~/widgets/${sliceName}/model/${composableName}";
export { default as ${componentName} } from "~/widgets/${sliceName}/ui/${componentName}.vue";
`,
    dryRun
  );
}

function inferWidgetNameFromPageRoute(routePath) {
  const segments = routePath.split("/").filter(Boolean);
  const staticSegments = segments.filter((segment) => !/^\[[^\]]+\]$/.test(segment));
  const base = staticSegments.at(-1) ?? "page";

  return `${base}-page`;
}

function createPageSlice({ appDir, pageRoute, widgetName, dryRun }) {
  const pagesDir = path.join(appDir, "src", "pages");
  const pageFilePath = path.join(pagesDir, `${pageRoute}.vue`);
  const widgetSliceName = toKebabCase(widgetName);
  const widgetComponentName = `${toPascalCase(widgetSliceName)}Widget`;

  ensureDir(path.dirname(pageFilePath), dryRun);

  writeFileSafe(
    pageFilePath,
    `<template>
  <${widgetComponentName} />
</template>

<script setup lang="ts">
import { ${widgetComponentName} } from "~/widgets/${widgetSliceName}";
</script>
`,
    dryRun
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const appDir = args["app-dir"] ? path.resolve(args["app-dir"]) : process.cwd();
  const sliceType = args.type;
  const rawName = args.name;
  const dryRun = args["dry-run"] === "true";
  const rawWidgetName = args.widget;

  if (!sliceType || !rawName) {
    fail(
      "Usage: node scripts/generate-web-slice.mjs --app-dir <dir> --type <feature|widget|page> --name <slice-name> [--widget <widget-slice>] [--dry-run]"
    );
  }

  const srcDir = path.join(appDir, "src");

  if (!fs.existsSync(srcDir)) {
    fail(`Not a supported web app directory: missing ${srcDir}`);
  }

  if (sliceType === "feature") {
    const sliceName = toKebabCase(rawName);

    if (!sliceName) {
      fail("Slice name is empty after normalization.");
    }

    createFeatureSlice({ appDir, sliceName, dryRun });
  } else if (sliceType === "widget") {
    const sliceName = toKebabCase(rawName);

    if (!sliceName) {
      fail("Slice name is empty after normalization.");
    }

    createWidgetSlice({ appDir, sliceName, dryRun });
  } else if (sliceType === "page") {
    const pageRoute = normalizePageRoute(rawName);

    if (!pageRoute) {
      fail("Page route is empty after normalization.");
    }

    const widgetName = rawWidgetName
      ? toKebabCase(rawWidgetName)
      : inferWidgetNameFromPageRoute(pageRoute);
    createPageSlice({ appDir, pageRoute, widgetName, dryRun });
  } else {
    fail(`Unsupported type "${sliceType}". Use "feature", "widget" or "page".`);
  }

  console.log(
    `${dryRun ? "[dry-run] " : ""}Generated ${sliceType} slice "${rawName}" in ${appDir}`
  );
}

main();
