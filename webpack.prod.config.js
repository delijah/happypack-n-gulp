const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 10 });

module.exports = {
    debug: false,
    entry: {
        app: [ path.resolve('app/scripts/index.js'), path.resolve('app/styles/app.sass') ],
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].bundle.js',
        publicPath: '/',
    },
    module: {
        loaders: [{
            test: /\.sass$/,
            include: path.resolve('app/styles'),
            loader: 'happypack/loader?id=sass',
        }, {
            test: /\.js$/,
            include: path.resolve('app/scripts'),
            loader: 'happypack/loader?id=js',
        }],
    },
    postcss: () => [ autoprefixer({ browsers: [ 'last 2 versions' ] }) ],
    plugins: [
        new HappyPack({
            id: 'sass',
            loaders: [ 'style', 'css', 'postcss', 'sass' ],
            threadPool: happyThreadPool,
        }),
        new HappyPack({
            id: 'js',
            loaders: [ 'babel' ],
            threadPool: happyThreadPool,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve('app/index.html'),
            inject: true,
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
            },
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
    ],
};
