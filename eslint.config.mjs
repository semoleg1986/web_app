import js from "@eslint/js";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";

const nuxtGlobals = {
  computed: "readonly",
  createError: "readonly",
  defineEventHandler: "readonly",
  defineNuxtConfig: "readonly",
  getRouterParam: "readonly",
  navigateTo: "readonly",
  onMounted: "readonly",
  process: "readonly",
  reactive: "readonly",
  ref: "readonly",
  setHeader: "readonly",
  useFetch: "readonly",
  useHead: "readonly",
  useRoute: "readonly",
  useRuntimeConfig: "readonly",
  useSeoMeta: "readonly",
  useState: "readonly",
  watch: "readonly",
  watchEffect: "readonly"
};

const restrictedSharedImports = [
  {
    group: ["~/app/**", "~/features/**", "~/pages/**", "~/server/**", "~/widgets/**"],
    message: "shared layer must stay dependency-free from app/pages/widgets/features/server."
  }
];

const restrictedFeatureImports = [
  {
    group: ["~/app/**", "~/pages/**", "~/server/**", "~/widgets/**"],
    message: "feature layer may depend only on itself and shared."
  }
];

const restrictedWidgetImports = [
  {
    group: ["~/app/**", "~/pages/**", "~/server/**"],
    message: "widget layer may depend on features and shared, but not on pages/app/server."
  }
];

export default [
  {
    ignores: [".nuxt/**", ".output/**", "node_modules/**", "coverage/**"]
  },
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs,vue}"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"]
      },
      globals: nuxtGlobals
    },
    plugins: {
      "@typescript-eslint": tsEslint
    },
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: ["src/pages/**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off"
    }
  },
  {
    files: ["scripts/**/*.mjs"],
    rules: {
      "no-console": "off"
    }
  },
  {
    files: ["src/shared/**/*.{ts,tsx,js,mjs,cjs,vue}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: restrictedSharedImports }]
    }
  },
  {
    files: ["src/features/**/*.{ts,tsx,js,mjs,cjs,vue}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: restrictedFeatureImports }]
    }
  },
  {
    files: ["src/widgets/**/*.{ts,tsx,js,mjs,cjs,vue}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: restrictedWidgetImports }]
    }
  },
  eslintConfigPrettier
];
