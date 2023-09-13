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
  ]
}
`
export const TSCONFIG_NODE_JSON_CONTENT = `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
  },
  "include": []
}
`

export const ESLINT_CONFIG = `import { all } from '@chenyueban/eslint-config'

export default all
`

export const VSCODE_SETTING = `{
  "eslint.experimental.useFlatConfig": true,
  "typescript.tsdk": "node_modules/typescript/lib"
}
`

export const LINTSTAGEDRC = `{
  "*.{js?(x),ts?(x),vue,html,md,json,yml}": [
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
