const { resolve, join } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const config = require('./config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const CF_APP_DIR = resolve(__dirname, '../src/CF/')
const SHARED_DIR = resolve(__dirname, '../src/Shared/')

module.exports = (env) => {
  const isProd = !!env.production
  return {
    entry: './src/CF/index.tsx',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [CF_APP_DIR, SHARED_DIR, '../node_modules'],
      plugins: [new TsconfigPathsPlugin()],
    },
    output: {
      filename: '[name].[hash].js',
      path: join(__dirname, '../build/cf'),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015',
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|woff|woff2|xlsx)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: false,
                name: 'assets/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        isProd
          ? new TerserPlugin({
              parallel: true,
              extractComments: true,
            })
          : false,
      ].filter(Boolean),
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    devServer: {
      historyApiFallback: true,
    },
    // "eval" values omit styles source map
    // reason: https://github.com/webpack-contrib/sass-loader/releases/tag/v8.0.0
    // "inline-source-map" not working with ts(x) files
    // reason: ¯\_(ツ)_/¯, just experiment
    devtool: !isProd ? 'source-map' : '',
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/CF/index.html',
        minify: {
          collapseWhitespace: true,
        },
        hash: true, // append a unique webpack compilation hash to all included scripts
        cache: true, // Emit the file only if it was changed
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          API_BASE_URL: JSON.stringify(config.API_BASE_URL),
          REACT_APP_URL: JSON.stringify(config.REACT_APP_URL),
          REACT_APP_LOGIN_URL: JSON.stringify(config.REACT_APP_LOGIN_URL),
          REACT_APP_GOOGLE_MAP_KEY: JSON.stringify(
            config.REACT_APP_GOOGLE_MAP_KEY
          ),
          REACT_APP_DOMAIN: JSON.stringify(config.REACT_APP_DOMAIN),
          REACT_APP_SUBDOMAIN: JSON.stringify(config.REACT_APP_SUBDOMAIN),
        },
      }),
      !isProd
        ? new ForkTsCheckerWebpackPlugin({
            eslint: true,
          })
        : false,
      // to clean build dir
      isProd ? new CleanWebpackPlugin() : false,
      isProd
        ? new OptimizeCssAssetsPlugin({
            cssProcessorPluginOptions: {
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                },
              ],
            },
          })
        : false,
    ].filter(Boolean),
  }
}
