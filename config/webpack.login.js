const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const config = require('./config');

module.exports = () => {
    return {
        entry: './src/Login/index.tsx',
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                components: path.resolve(__dirname, '../src/components/')
            }
        },
        output: {
            filename: '[name].[hash].js',
            path: path.join(__dirname, '../build/login'),
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
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/Login/index.html'
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    REACT_APP_BASE_URL: JSON.stringify(config.REACT_APP_BASE_URL),
                    REACT_APP_LOGIN_URL: JSON.stringify(config.REACT_APP_LOGIN_URL),
                    REACT_APP_MOHASSEL_URL: JSON.stringify(config.REACT_APP_MOHASSEL_URL),
                },}),
            new ForkTsCheckerWebpackPlugin({ eslint: true })
        ]
    }
};