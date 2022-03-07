#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { pkgUp } from 'pkg-up'

const TSCONFIG_JSON_CONTENT = `{
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
const TSCONFIG_NODE_JSON_CONTENT = `{
  "compilerOptions": {
    "composite": true,
    "module": "esnext",
    "moduleResolution": "node"
  }
}
`

async function main() {
  const cwd = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

  const pkg = await pkgUp({ cwd })
  if (!pkg) {
    return 0
  }
  const pkgDir = dirname(pkg)

  const tsconfigFile = join(pkgDir, 'tsconfig.json')
  const tsconfigNodeFile = join(pkgDir, 'tsconfig.node.json')

  if (!fs.existsSync(tsconfigFile)) {
    console.info(`@chenyueban/tsconfig: auto generated ${tsconfigFile}`)
    fs.writeFileSync(tsconfigFile, TSCONFIG_JSON_CONTENT)
  }
  if (!fs.existsSync(tsconfigNodeFile)) {
    console.info(`@chenyueban/tsconfig: auto generated ${tsconfigNodeFile}`)
    fs.writeFileSync(tsconfigNodeFile, TSCONFIG_NODE_JSON_CONTENT)
  }
  return 0
}

main()
  .then(process.exit)
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
