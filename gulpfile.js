/*global -$ */
'use strict';
var gulp = require('gulp');
const {
  dest,
  src,
  task
} = require('gulp');
var sass = require('gulp-sass');
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var sassGlob = require('gulp-sass-glob');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cssbeautify = require('gulp-cssbeautify');
var bourbon = require('bourbon').includePaths;
var neat = require('bourbon-neat').includePaths;
var csso = require('gulp-csso');
var concat = require('gulp-concat')
var sassLint = require('gulp-sass-lint');
const lesshint = require('gulp-lesshint');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const minify = require('gulp-minify');
var shell = require('gulp-shell');
var notify = require('gulp-notify');
var cp = require('child_process').spawn;
var spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();;
var reload = browserSync.reload;


var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};


var paths = {
  sass: {
    src: 'source/sass/**/*.scss',
    dest: 'build/css/'
  },
  less: {
    src: 'source/less/**/*.less',
    dest: 'build/css/'
  },
  scripts: {
    src: 'source/scripts/**/*.js',
    dest: 'build/scripts/'
  }
};

function BrowserSync() {
  //watch files
  var files = [
    'source/sass/**/*.scss',
    'source/less/**/*.less',
    'source/scripts/**/*.js',
    'source/images/**/*',
    'templates/**/*.php'
  ];
  //initialize browsersync
  browserSync.init(files, {
    proxy: "pfizerus1.demoserver.com:8084" // BrowserSync proxy, change to match your local environment
  });
}

// BrowserSync Reload
function browserSyncReload(done) {
  BrowserSync.reload();
  done();
}

/*
 * Tasks Sass processing
 */

function Sassstyles() {
  return gulp.src(paths.sass.src, {
      allowEmpty: true
    })
    .pipe(sassGlob())
    .pipe(sass({
      includePaths: [bourbon, neat, sassOptions]
    }))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(csso({
      restructure: true,
      sourceMap: true,
      debug: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.sass.dest));
}

function Sasslint() {
  return gulp.src(paths.sass.src)
    .pipe(sassLint({}))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
}

/*
 * Ttasks using Sass processing
 */
function Lessstyles() {
  return gulp.src(paths.less.src)
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.less.dest));
}

function LessBeautify() {
  return gulp.src(paths.less.src)
    .pipe(lesshint({
      'config': '/.sass-lint.yml'
    }))
    .pipe(lesshint.reporter()) // Leave empty to use the default, "stylish"
}


/*
 * Task eslint functions lint js and minifyJs
 */
function isFixed(file) {
  return file.eslint != null && file.eslint.fixed;
}

function Jslint() {
  return gulp.src(paths.scripts.src)
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.format())
    // if fixed, write the file to dest
    .pipe(gulpIf(isFixed, dest('./source/scripts/')));
}

function minifyJs() {
  return gulp.src(paths.scripts.src)
    .pipe(minify({
      ext: {
        src: '-debug.js',
        min: '.min.js'
      },
      ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('./build/scripts/'))
}




/*
 * Create sprite image/css
 */
function spriteGenrate() {
  return gulp.src('source/images/sprite/**/*')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css'
    }))
    .pipe(gulp.dest('./build/images/'));
};

/*
 * Compress images
 */
function imageCompress() {
  return gulp.src('source/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images/'))
}


function watch() {
  gulp.watch(paths.sass.src, gulp.series(Sassstyles, Sasslint), browserSyncReload);
  gulp.watch('source/images/**/*', gulp.series(spriteGenrate, imageCompress));
  gulp.watch(paths.scripts.src, gulp.series(Jslint, minifyJs,), browserSyncReload);
  //gulp.watch(paths.less.src, gulp.series(Lessstyles, LessBeautify) , browserSyncReload);

}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */

var spriteImage = gulp.series(spriteGenrate, imageCompress);
var sassTask = gulp.series(Sasslint);
var jsTask = gulp.series(Jslint, minifyJs);
var build = gulp.series(gulp.parallel(watch)); /* BrowserSync */

exports.spriteImage = spriteImage;
exports.sassTask = sassTask;
exports.jsTask = jsTask;
exports.build = build;
exports.default = build;
