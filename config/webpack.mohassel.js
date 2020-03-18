const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = () => {
    const env = dotenv.config().parsed;
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});
    return {
        entry: './src/Mohassel/index.tsx',
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                components: path.resolve(__dirname, '../src/components/')
            }
        },
        output: {
            path: path.join(__dirname, '../build/mohassel'),
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
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
            ]
        },
        devServer: {
            historyApiFallback: true,
        },
        plugins: [
            new webpack.DefinePlugin(envKeys),
            new HtmlWebpackPlugin({
                template: './src/Mohassel/index.html'
            }),
            // new webpack.DefinePlugin({
            //     'process.env.development': !!(env && !env.production),}),
            new ForkTsCheckerWebpackPlugin({eslint: true})
        ]
    }
};