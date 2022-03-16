import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { pkgUp } from 'pkg-up'
import { installPackage } from '@antfu/install-pkg'
import { consola } from '@chenyueban/utils'

export async function setNpmScripts(
  cwd: string,
  scripts: Record<string, string>,
) {
  const pkgFile = await pkgUp({ cwd })
  if (pkgFile) {
    const pkgJson = await readFile(pkgFile, { encoding: 'utf8' })
    const pkg = JSON.parse(pkgJson)
    if (pkg.scripts) for (const key in scripts) pkg.scripts[key] = scripts[key]
    else pkg.scripts = scripts

    await writeFile(pkgFile, JSON.stringify(pkg, null, 2))
  }
}

export interface BootstrapConfig {
  packageName?: string
  afterInstall?: (cwd: string) => Promise<void>
  configFile?: {
    configFileName: string
    configFileRaw: string
    // Whether to overwrite the original file
    override?: boolean
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

    if (afterInstall) await afterInstall(cwd)

    if (configFile) {
      const { configFileName, configFileRaw, override } = configFile
      const configFilePath = join(cwd, configFileName)
      if (override || !existsSync(configFilePath)) {
        await writeFile(configFilePath, configFileRaw)
        consola.info(`auto generated ${configFileName}`)
      }
    }
  }
}
