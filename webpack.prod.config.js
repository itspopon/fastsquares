const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  mode: "production",
  entry: './src/client/index.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            { loader: 'css-loader', options: { importLoaders: 1 } }, // translates CSS into CommonJS
            { loader: 'postcss-loader', options: {
              ident: 'postcss',
              plugins: () => [
                postcssPresetEnv(/* pluginOptions */)
              ]
            } },
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
    },
    {
      test: /\.css$/,
      use: [
          "style-loader", // creates style nodes from JS strings
          { loader: 'css-loader', options: { importLoaders: 1 } }, // translates CSS into CommonJS
          { loader: 'postcss-loader', options: {
            ident: 'postcss',
            plugins: () => [
              postcssPresetEnv(/* pluginOptions */)
            ]
          } }
      ]
  }
    ]
  },
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: __dirname + '/public/js',
    publicPath: '/',
    filename: 'bundle.js'
  }
};