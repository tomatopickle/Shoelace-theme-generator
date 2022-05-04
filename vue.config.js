const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  /* your config */
  configureWebpack: {
    optimization: {
      runtimeChunk: 'single',
    },
  },
  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all',
    client: {
      webSocketURL: `wss:/0.0.0.0/ws`,
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options['compilerOptions'] = {
          ...options.compilerOptions || {},
          isCustomElement: tag => tag.startsWith('sl-')
        };
        return options;
      })
  }
});