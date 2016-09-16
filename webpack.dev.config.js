const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 10 });

module.exports = {
    debug: true,
    entry: {
        app: [ 'react-hot-loader/patch', path.resolve('app/scripts/index.js'), path.resolve('app/styles/app.sass') ],
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
            loaders: [ 'style', 'css?sourceMap', 'postcss?sourceMap=inline', 'sass?sourceMap' ],
            threadPool: happyThreadPool,
        }),
        new HappyPack({
            id: 'js',
            loaders: [ 'babel' ],
            threadPool: happyThreadPool,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve('app/index.html'),
            inject: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'cheap-eval-source-map',
    devServer: {
        contentBase: path.resolve('dist'),
        hot: true,
        historyApiFallback: {
            rewrites: [
                { from: /\.[a-z0-9]{2,4}$/i, to(result) { return result.parsedUrl.pathname; } },
            ],
        },
    },
};
