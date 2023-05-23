const { withEdgio } = require('@edgio/next/config')

module.exports = withEdgio({
  output: 'standalone',
  experimental: {
    appDir: true,
  },
})
