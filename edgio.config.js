module.exports = {
  connector: './edgio',
  routes: './edgio/routes.ts',
  origins: [
    {
      name: 'api',
      override_host_header: 'api.tvmaze.com',
      hosts: [
        {
          scheme: 'match',
          location: [
            {
              hostname: 'api.tvmaze.com',
            },
          ],
        },
      ],
      tls_verify: {
        allow_self_signed_certs: true,
      },
    },
    {
      name: 'api_themoviedb',
      override_host_header: 'api.themoviedb.org',
      hosts: [
        {
          scheme: 'match',
          location: [
            {
              hostname: 'api.themoviedb.org',
            },
          ],
        },
      ],
      tls_verify: {
        allow_self_signed_certs: true,
      },
    },
    {
      name: 'image',
      override_host_header: 'opt.moovweb.net',
      hosts: [
        {
          scheme: 'match',
          location: [
            {
              hostname: 'opt.moovweb.net',
            },
          ],
        },
      ],
      tls_verify: {
        allow_self_signed_certs: true,
      },
    },
  ],
}
