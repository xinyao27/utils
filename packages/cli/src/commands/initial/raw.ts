export const NPMRC = `enable-pre-post-scripts=true
`
export const EDITOR_CONFIG = `root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
`

export const TSCONFIG_JSON_CONTENT = `{
  "extends": "@chenyueban/tsconfig",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules/",
    "dist/"
  ],
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}
`
export const TSCONFIG_NODE_JSON_CONTENT = `{
  "compilerOptions": {
    "composite": true,
    "module": "esnext",
    "moduleResolution": "node"
  }
}
`

export const ESLINTRC_VANILLA = `{
  "extends": "./node_modules/@chenyueban/lint/src/vanilla.cjs"
}
`
export const ESLINTRC_REACT = `{
  "extends": "./node_modules/@chenyueban/lint/src/react.cjs"
}
`
export const ESLINTRC_VUE = `{
  "extends": "./node_modules/@chenyueban/lint/src/vue.cjs"
}
`

export const PRETTIERRC = `{
  "singleQuote": true,
  "semi": false,
  "endOfLine": "lf"
}
`

export const LINTSTAGEDRC = `{
  "*.{md,json,yml}": ["prettier --write", "git add"],
  "*.{js,jsx,vue,html}": ["prettier --write", "eslint --fix", "git add"],
  "*.ts?(x)": [
    "prettier --parser=typescript --write",
    "eslint --fix",
    "git add"
  ]
}
`

export const COMMITLINTRC = `{
  "extends": ["@commitlint/config-conventional"]
}
`

export const CZRC = `{
  "path": "cz-conventional-changelog"
}
`

export const RELEASE_IT = `{
  "git": {
    "commitMessage": "chore: release v\${version}"
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "angular",
      "infile": "CHANGELOG.md"
    }
  }
}
`

export const GITIGNORE = `# compiled output
dist
node_modules

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
coverage
/.nyc_output

# IDEs and editors
.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# config
.env
`
