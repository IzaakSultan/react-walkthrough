module.exports = {
  stories: ['../src/**/*.stories.[tj]s'],
  webpackFinal: (config) => {

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: '[local]-[hash:base64:4]',
            }
          },
        },
        'sass-loader',
      ]
    });

    return config;
  },
};
