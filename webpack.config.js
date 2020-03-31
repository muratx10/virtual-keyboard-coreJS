const path = require('path');
const sass = require('sass');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const conf = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  devServer: {
    watchContentBase: true,
    overlay: true,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: false,
          },
        },
      },
      {
        test: /\.scss/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
        },
        {
          loader: 'sass-loader',
          options: {
            implementation: sass,
            sourceMap: true,
          },
        },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/images',
          },
        }],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/fonts',
          },
        }],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
      sourceMap: true,
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: false,
    }),
  ],
};

module.exports = conf;
