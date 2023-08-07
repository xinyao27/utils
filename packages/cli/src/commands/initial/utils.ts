import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
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
    if (pkg.scripts) {
      for (const key in scripts) {
        pkg.scripts[key] = scripts[key]
      }
    }
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
export const bootstrapTasks: { cwd: string; config: BootstrapConfig }[] = []
export function bootstrap(cwd: string, configs: BootstrapConfig[]) {
  configs.forEach((config) => {
    bootstrapTasks.push({ cwd, config })
  })
}
export async function install(monorepo: boolean) {
  // install packages
  for (const { cwd, config } of bootstrapTasks) {
    const { packageName, afterInstall, configFile } = config

    if (packageName) {
      await installPackage(packageName, {
        dev: true,
        cwd,
        packageManager: 'pnpm',
        additionalArgs: [monorepo ? '-w' : ''],
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
