const gulp = require('gulp');
const del = require('del');
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const { watch, series } = require('gulp');

const paths = {
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'dist/scripts/'
  },
  styles: {
    src: 'src/styles/*.scss',
    dest: 'dist/styles/'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  }
};

const clean = () => del(['dist']);

const server = browserSync.create();

function test(done) {
  console.log('Gulp is running');
  done()
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(concat('index.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function styles() {
  return gulp.src(paths.styles.src, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.styles.dest));
}

function html() {
  return gulp.src(paths.html.src, { sourcemaps: true })
    .pipe(gulp.dest(paths.html.dest));
}


function reload(done) {
  server.reload();
  done();
}

function initServe(done) {
  server.init({
    server: 'dist'
  });
  done();
}

function watchFiles() {
  watch('src/*.html', { usePolling: true }, gulp.series(html, reload));
  watch('src/styles/*.scss', { usePolling: true }, gulp.series(styles, reload));
  watch('src/scripts/*.js', { usePolling: true }, gulp.series(scripts, reload));
}

exports.default = test;
exports.serve = gulp.series(clean, scripts, styles, html, initServe, watchFiles);
