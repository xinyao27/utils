import fs from 'fs/promises'
import path from 'path'
import { pkgUp } from 'pkg-up'
import { installPackage } from '@antfu/install-pkg'
import { consola } from '@chenyueban/utils'

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
      await fs.writeFile(configFilePath, configFileRaw)
      consola.info(`auto generated ${configFileName}`)
    }
  }
}
