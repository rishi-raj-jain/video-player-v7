const { join, relative } = require('path')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()

module.exports = async function build() {
  const builder = new DeploymentBuilder()
  builder.clearPreviousBuildOutput()
  await builder.exec('npx next build')
  builder.addJSAsset(join(appDir, '.env.production'))
  builder.addJSAsset(join(appDir, '.next', 'standalone'), 'dist')
  builder.addJSAsset(join(appDir, 'public'), join('dist', 'public'))
  const publicDir = join(appDir, 'public')
  builder.writeFileSync(
    join(builder.jsDir, 'public_routes'),
    (await import('globby'))
      .globbySync(publicDir, {
        onlyFiles: true,
      })
      .map((i) => relative(publicDir, i))
      .join(',')
  )
  await builder.buildServiceWorker({
    swSrc: join(appDir, 'sw', 'service-worker.ts'),
    swDest: join(appDir, '.edgio', 'temp', 'service-worker.js'),
  })
  await builder.build()
  builder.removeSync(join(builder.jsDir, 'dist', 'public'))
}
