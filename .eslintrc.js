module.exports = {
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    // Plugin Rules
    "@typescript-eslint/brace-style": [
      "error",
      "1tbs",
      { allowSingleLine: true },
    ],
    "@typescript-eslint/consistent-type-imports": ["warn"],
    "@typescript-eslint/indent": [
      "warn",
      4,
      {
        SwitchCase: 1,
        ignoredNodes: [
          // Ignore multi-line generics in function calls.
          "CallExpression > TSTypeParameterInstantiation.typeParameters",
          // Ignore multi-line generics in function definitions.
          "TSTypeReference > TSTypeParameterInstantiation.typeParameters",
          // Ignore multi-line union types
          "TSUnionType",
        ],
      },
    ],
    "@typescript-eslint/member-delimiter-style": ["warn"],
    "@typescript-eslint/no-unused-vars": ["error"],

    // Import Rules
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/first": ["error"],
    "import/newline-after-import": ["warn", { count: 4 }],
    "import/no-absolute-path": ["error"],
    "import/no-mutable-exports": ["error"],
    // "import/no-relative-parent-imports": ["error"],
    "import/no-useless-path-segments": ["error"],
    "import/no-unresolved": ["error"],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          orderImportKind: "asc",
          caseInsensitive: true,
        },
      },
    ],

    // "jest/no-mocks-import": "warn",

    // "unicorn/empty-brace-spaces": "off",
    // "unicorn/filename-case": [
    //     "error",
    //     {
    //         cases: {
    //             camelCase: true,
    //             kebabCase: true,
    //             pascalCase: true,
    //         },
    //     },
    // ],
    // "unicorn/prefer-number-properties": "off",

    // Default auto-fix rules
    "arrow-parens": ["warn", "as-needed"],
    "block-spacing": ["warn", "always"],
    "comma-dangle": ["warn", "always-multiline"],
    curly: ["warn", "all"],
    "jsx-quotes": ["warn", "prefer-double"],
    "no-multi-spaces": ["off"],
    "object-curly-spacing": [
      "warn",
      "always",
      { objectsInObjects: true, arraysInObjects: true },
    ],
    "padded-blocks": ["warn", "never"],
    "padding-line-between-statements": [
      "warn",
      { blankLine: "always", prev: "*", next: "return" },
      { blankLine: "always", prev: "*", next: "function" },
      { blankLine: "always", prev: "function", next: "*" },
    ],
    "quote-props": ["warn", "consistent-as-needed"],
    quotes: ["warn", "double"],
    "space-before-blocks": ["warn", "always"],
    semi: ["warn", "always"],

    // Default non-auto-fix rules
    "max-len": [
      "error",
      {
        code: 120,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
      },
    ],
    "no-tabs": "error",
  },
};
