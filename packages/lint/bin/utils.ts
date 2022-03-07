import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { yellow, cyan, red } from 'kolorist'
import { pkgUp } from 'pkg-up'
import { installPackage } from '@antfu/install-pkg'

export function log(data: string) {
  // eslint-disable-next-line no-console
  console.log(yellow('[@chenyueban/lint]: '), cyan(data))
}

export function warn(data: string) {
  console.warn(yellow('[@chenyueban/lint]: '), red(data))
}

export function error(data: string) {
  console.error(yellow('[@chenyueban/lint]: '), red(data))
}

export async function setNpmScripts(
  cwd: string,
  scripts: Record<string, string>
) {
  const pkgFile = await pkgUp({ cwd })
  if (pkgFile) {
    const pkgJson = await fs.readFile(pkgFile, { encoding: 'utf8' })
    const pkg = JSON.parse(pkgJson)
    if (pkg.scripts) {
      // eslint-disable-next-line guard-for-in
      for (const key in scripts) {
        pkg.scripts[key] = scripts[key]
      }
    } else {
      pkg.scripts = scripts
    }
    await fs.writeFile(pkgFile, JSON.stringify(pkg, null, 2))
  }
}

export interface BootstrapConfig {
  name?: string
  afterInstall?: (cwd: string) => Promise<void>
  packageName?: string
  configFile?: {
    configFileName: string
    configFileRaw: string
  }
}
export async function bootstrap(cwd: string, configs: BootstrapConfig[]) {
  // install packages
  for (const { packageName, afterInstall, configFile } of configs) {
    if (packageName) {
      await installPackage(packageName, {
        dev: true,
        cwd,
        packageManager: 'pnpm',
        additionalArgs: ['-W'],
      })
    }

    if (afterInstall) {
      await afterInstall(cwd)
    }

    if (configFile) {
      const { configFileName, configFileRaw } = configFile
      const configFilePath = path.join(cwd, configFileName)
      if (!existsSync(configFilePath)) {
        await fs.writeFile(configFilePath, configFileRaw)
        log(`auto generated ${configFileName}`)
      }
    }
  }
}
