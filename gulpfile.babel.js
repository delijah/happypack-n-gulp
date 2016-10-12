import gulp from 'gulp';
import gulpUtil from 'gulp-util';
import browserSync from 'browser-sync';
import del from 'del';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import webpackDevConfig from './webpack.dev.config';
import webpackProdConfig from './webpack.prod.config';

gulp.task('clean', del.bind(null, [ '.tmp', 'dist' ]));

gulp.task('webpack', cb => {
    // https://webpack.github.io/docs/usage-with-gulp.html

    webpackDevConfig.entry.app.unshift(
        'webpack-dev-server/client?http://localhost:9000/',
        'webpack/hot/only-dev-server'
    );

    const compiler = webpack(webpackDevConfig);

    new WebpackDevServer(compiler,
        webpackDevConfig.devServer
    ).listen(9000);
});

gulp.task('webpack-build', cb => {
    // https://webpack.github.io/docs/usage-with-gulp.html

    webpack(webpackProdConfig, (err, stats) => {
        if (err) {
            throw new gulpUtil.PluginError('webpack', err);
        }

        if (stats.compilation.errors.length) {
            gulpUtil.log('webpack', '\n' + stats.toString({ colors: true }));
        }

        cb();
    });
});

gulp.task('serve', [ 'webpack' ]);

gulp.task('serve:dist', () => {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: [ 'dist' ],
        },
    });
});

gulp.task('build', [ 'webpack-build' ]);

gulp.task('default', [ 'clean' ], () => {
    gulp.start('build');
});
