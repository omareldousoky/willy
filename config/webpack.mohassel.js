const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const config = require('./config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env) => {
	const isProd = !!env.production
    return {
        entry: './src/Mohassel/index.tsx',
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                components: path.resolve(__dirname, '../src/components/')
            }
        },
        output: {
            filename: '[name].[hash].js',
            path: path.join(__dirname, '../build/mohassel'),
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        // disable type checker - we will use it in fork plugin
                        transpileOnly: true
                    },
                    exclude: /dist/,
                },
                // sass-loader
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
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                esModule: false,
                                name: 'assets/[name].[hash:8].[ext]'
                            },
                        },
                    ],
                },
            ]
        },
        devServer: {
            historyApiFallback: true,
        },
		  optimization: {
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
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/Mohassel/index.html',
				filename: isProd ? 'index.[hash].html' : 'index.html',
				chunks: ['main', 'vendors'],
            }),
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css',
			}),
            new webpack.DefinePlugin({
                'process.env': {
                    REACT_APP_BASE_URL: JSON.stringify(config.REACT_APP_BASE_URL),
                    REACT_APP_MOHASSEL_URL: JSON.stringify(config.REACT_APP_MOHASSEL_URL),
                    REACT_APP_LOGIN_URL: JSON.stringify(config.REACT_APP_LOGIN_URL),
                    REACT_APP_GOOGLE_MAP_KEY: JSON.stringify(config.REACT_APP_GOOGLE_MAP_KEY),
                    REACT_APP_DOMAIN: JSON.stringify(config.REACT_APP_DOMAIN),
                    REACT_APP_LTS_SUBDOMAIN: JSON.stringify(config.REACT_APP_LTS_SUBDOMAIN),
                },}),
            new ForkTsCheckerWebpackPlugin({eslint: true}),
			new CleanWebpackPlugin(),
			isProd ? new OptimizeCssAssetsPlugin({
				cssProcessorPluginOptions: {
					preset: ['default', { discardComments: { removeAll: true } }],
				},
			}) :  false,
        ].filter(Boolean)
    }
};