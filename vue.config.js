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
  pwa: {
    name: 'Shoelace Theme Generator',
    themeColor: '#1caaea',
    msTileColor: '#1caaea',
    appleMobileWebAppCapable: 'no',
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => { args[0].title = 'Shoelace Theme Generator'; return args; });
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