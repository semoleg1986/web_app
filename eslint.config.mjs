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
  eslintConfigPrettier
];
