// webpack.config.cjs for JS and JSON (default), TS, HTML, CSS, SCSS, TailwindCSS
// https://webpack.js.org

const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: devMode ? 'development' : 'production', // development, production(default) or none
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    proxy: {
      '/api': `http://localhost:8080`,
    },
    historyApiFallback: true,
    compress: true,
    port: 9000,
  },
  devtool: devMode ? 'inline-source-map' : false,
  entry: {
    // start bundling from here
    home: './public/lib/script/pages/index.js',
    docs: './public/lib/script/pages/docs.js',
  },
  output: {
    // bundle to this location
    path: path.resolve(__dirname, 'dist'),
    filename: devMode ? 'bundle.[name].js' : 'bundle.[name].[contenthash].js',
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    },
  },
  plugins: [
    // https://webpack.js.org/plugins/
    new HtmlWebpackPlugin({
      // minifies html and adds imports
      filename: 'index.html',
      template: 'public/routes/index.html',
      chunks: ['home'], // only include the 'home' chunk
    }),
    new HtmlWebpackPlugin({
      filename: 'docs.html',
      template: 'public/routes/docs.html',
      chunks: ['docs'], // only include the 'docs' chunk
    }),
    new MiniCssExtractPlugin({
      // minifies css and splits it
      filename: devMode ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
    }),
  ],
  module: {
    // loaders, so that webpack understands more than JavaScript and JSON
    rules: [
      {
        // Docs
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
            options: {
              // https://marked.js.org/using_advanced#options
            },
          },
        ],
      },
      {
        // static assets (Images, Fonts, etc.)
        test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        // TS (`.ts`, `.cts`, `.mts` or `.tsx`)
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader',
      },
      {
        // SCSS/SASS
        test: /\.s[ac]ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        // CSS
        test: /\.css$/i, // type to transform
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader', // TailwindCSS, Autoprefixer, etc. (postcss.config.cjs)
            options: {
              postcssOptions: {
                plugins: [
                  // bundle optimization, asset management, injection of env variables...
                  ['postcss-preset-env', {}],
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
