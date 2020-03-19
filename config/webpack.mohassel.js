const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const config = require('./config');

module.exports = () => {
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
            new HtmlWebpackPlugin({
                template: './src/Mohassel/index.html'
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    REACT_APP_BASE_URL: JSON.stringify(config.REACT_APP_BASE_URL),
                    REACT_APP_MOHASSEL_URL: JSON.stringify(config.REACT_APP_MOHASSEL_URL),
                    REACT_APP_GOOGLE_MAP_KEY: JSON.stringify(config.REACT_APP_GOOGLE_MAP_KEY)
                },}),
            new ForkTsCheckerWebpackPlugin({eslint: true})
        ]
    }
};