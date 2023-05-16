import * as dotenv from 'dotenv'
import { Router, edgioRoutes } from '@edgio/core'
import { isProductionBuild } from '@edgio/core/environment'

dotenv.config({
  path: '.env.production',
})

const router = new Router()

router.match('/:path*', ({ cache, renderWithApp }) => {
  cache({
    edge: false,
    browser: false,
  })
  renderWithApp()
})

router.match('/service-worker.js', ({ serviceWorker }) => {
  serviceWorker('.edgio/temp/service-worker.js')
})

router.get('/l0-api/:path*', ({ proxy, cache, removeUpstreamResponseHeader }) => {
  removeUpstreamResponseHeader('set-cookie')
  removeUpstreamResponseHeader('cache-control')
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24,
      staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
    },
    browser: {
      serviceWorkerSeconds: 60,
    },
  })
  proxy('api', { path: '/:path*' })
})

router.get('/l0-themoviedb-api/:path*', ({ proxy, cache, removeUpstreamResponseHeader }) => {
  removeUpstreamResponseHeader('set-cookie')
  removeUpstreamResponseHeader('cache-control')
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24,
      staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
    },
    browser: {
      serviceWorkerSeconds: 60,
    },
  })
  proxy('api_themoviedb', {
    path: '/3/:path*',
    transformRequest: (request) => {
      const url = new URL(request.url, 'https://domain.com')
      url.searchParams.append('api_key', process.env.TMDB_KEY!)
      request.url = url.toString().replace('https://domain.com', '')
    },
  })
})

router.get('/l0-opt', ({ proxy, cache, removeUpstreamResponseHeader }) => {
  removeUpstreamResponseHeader('set-cookie')
  removeUpstreamResponseHeader('cache-control')
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    browser: {
      serviceWorkerSeconds: 60,
    },
  })
  proxy('image', { path: '/' })
})

router.get('/_next/image', ({ cache, renderWithApp, removeUpstreamResponseHeader }) => {
  removeUpstreamResponseHeader('set-cookie')
  removeUpstreamResponseHeader('cache-control')
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
    browser: {
      serviceWorkerSeconds: 60,
    },
  })
  renderWithApp()
})

if (isProductionBuild()) {
  router.static('public')

  router.match('/_next/static/:path*', ({ serveStatic }) => {
    serveStatic('.next/static/:path*')
  })
}

router.use(edgioRoutes)

module.exports = router
