const { sessionMiddleware, unstable_simpleRolesIsAuthorized } = require('@blitzjs/server')

module.exports = {
  env: {
    STRIPE_PK: process.env.STRIPE_PK,
  },
  middleware: [
    sessionMiddleware({
      unstable_isAuthorized: unstable_simpleRolesIsAuthorized,
    }),
  ],
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
