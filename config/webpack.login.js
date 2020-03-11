const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env) => {

    return {
        entry: './src/Login/index.tsx',
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                components: path.resolve(__dirname, '../src/components/')
            }
        },
        output: {
            path: path.join(__dirname, '../build/login-build'),
            filename: 'build.js'
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
                'process.env.development': !!(env && !env.production),}),
            new ForkTsCheckerWebpackPlugin({eslint: true})
        ]
    }
};