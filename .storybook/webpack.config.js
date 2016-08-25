const path = require('path');

module.exports = {
    module: {
        loaders: [
            {
                // SCSS loader
                test: /\.module\.scss$/,
                loader: 'style!css?modules&importLoaders=1&localIdentName=[local]-[hash:base64:4]!sass',
                include: path.resolve(__dirname, '../')
            }
        ]
    }
};
