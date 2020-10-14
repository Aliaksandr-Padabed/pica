const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function expressMiddleware(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://pixabay.com/api/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
