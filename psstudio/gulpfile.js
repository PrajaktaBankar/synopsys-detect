const { plugin } = require('mongoose');

const { series, src, dest } = require('gulp'),
_ = require('lodash'),
path = require('path'),
defaultAssets = require('./config/assets/default'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins({
        rename: {
            'gulp-angular-templatecache': 'templateCache'
        }
    });
const cssnanoOpts = {
    safe: true,
    discardUnused: false, // no remove @font-face
    reduceIdents: false // no change on @keyframes names
}
var assets = _.union(
    defaultAssets.client.js,
);
// JS minifying task
function uglify() {
    return src(assets)
        .pipe(plugins.babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify({
            mangle: false
        }))
        .pipe(plugins.concat('application.min.js'))
        .pipe(dest('public/dist'));
}
//ESLint JSLint tasks
function eslint(){
    var assets = _.union(
        defaultAssets.server.gulpConfig,
        defaultAssets.server.allJS,
        defaultAssets.client.js
      );
    
      return src(assets)
      .pipe(plugins.babel({
        presets: ['@babel/preset-env']
        }))
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format());
}
// CSS minifying task
function cssmin() {
    return src(defaultAssets.client.css)
        .pipe(plugins.concatCss('application.min.css'))
        .pipe(plugins.cssnano(cssnanoOpts))
        .pipe(dest('public/dist'));
}
function sass() {
    return src(defaultAssets.client.sass)
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.rename(function (file) {
            file.dirname = file.dirname.replace(path.sep + 'scss', path.sep + 'css');
        }))
        .pipe(dest('./modules/'));
}
// Less task
function less() {
    return src(defaultAssets.client.less)
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.rename(function (file) {
            file.dirname = file.dirname.replace(path.sep + 'less', path.sep + 'css');
        }))
        .pipe(dest('./modules/'));
}
// exports.build = build;
exports.build = series(less,sass,eslint,cssmin, uglify);