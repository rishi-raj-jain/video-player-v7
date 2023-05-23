import * as dotenv from 'dotenv'
import { Router } from '@edgio/core'
import { nextRoutes } from '@edgio/next'

dotenv.config({
  path: '.env.production',
})

const router = new Router()

router.use(nextRoutes)

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

module.exports = router
