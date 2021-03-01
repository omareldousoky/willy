const {
	resolve,
	join
} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const config = require('./config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const {
	CleanWebpackPlugin
} = require('clean-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const LOGIN_APP_DIR = resolve(__dirname, '../src/Login/')
const SHARED_DIR = resolve(__dirname, '../Shared/Login/')

module.exports = (env) => {

	const isProd = !!env.production
	return {
		entry: './src/Login/index.tsx',
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
			modules: [LOGIN_APP_DIR, SHARED_DIR, '../node_modules'],
		},
		output: {
			filename: '[name].[hash].js',
			path: join(__dirname, '../build/login'),
		},
		module: {
			rules: [{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					options: {
						// disable type checker - we will use it in fork plugin
						transpileOnly: true
					},
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
					test: /\.(png|svg|jpg)$/,
					use: [{
						loader: 'file-loader',
						options: {
							esModule: false,
							name: 'assets/[name].[hash:8].[ext]'
						},
					}],
				},
			]
		},
		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin({
				parallel: true,
				extractComments: true
			})],
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			},
		},
		// to get lines in code exactly
		devtool: !isProd ? 'inline-source-map' : '',
		devServer: {
			port: 8080,
			clientLogLevel: 'info',
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './src/Login/index.html',
				minify: {
					collapseWhitespace: true
				},
				hash: true, // append a unique webpack compilation hash to all included scripts
				cache: true, // Emit the file only if it was changed
			}),
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css',
			}),
			new webpack.DefinePlugin({
				'process.env': {
					REACT_APP_BASE_URL: JSON.stringify(config.REACT_APP_BASE_URL),
					REACT_APP_LOGIN_URL: JSON.stringify(config.REACT_APP_LOGIN_URL),
					REACT_APP_MOHASSEL_URL: JSON.stringify(config.REACT_APP_MOHASSEL_URL),
					REACT_APP_DOMAIN: JSON.stringify(config.REACT_APP_DOMAIN),
					REACT_APP_LTS_SUBDOMAIN: JSON.stringify(config.REACT_APP_LTS_SUBDOMAIN),
				},
			}),
			new ForkTsCheckerWebpackPlugin({
				eslint: true
			}),
			// to clean build dir
			isProd ? new CleanWebpackPlugin() : false,
			isProd ? new OptimizeCssAssetsPlugin({
				cssProcessorPluginOptions: {
					preset: ['default', {
						discardComments: {
							removeAll: true
						}
					}],
				},
			}) : false,
		].filter(Boolean)
	}
};
