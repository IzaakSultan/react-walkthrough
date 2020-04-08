const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        'react-walkthrough': './src/index.js'
    },
    externals: [
        'react', 'react-dom', 'immutable'
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'lib'),
        publicPath: '/',
        libraryTarget: 'umd',
        library: 'ReactWalkthrough'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    // 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]-[hash:base64:4]',
                            }
                        },
                    },
                    'sass-loader',
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'style.css',
        }),
    ]
};
