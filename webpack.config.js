var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'react-walkthrough': './src/index.js'
    },
    externals: [
        'react', 'react-dom', 'immutable'
    ],
    output: {
        filename: 'index.js',
        path: 'lib',
        publicPath: '/',
        libraryTarget: 'umd',
        library: 'ReactWalkthrough'
    },
    module: {
        loaders: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[local]-[hash:base64:4]!sass-loader')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css', {allChunks: true})
    ]
};
