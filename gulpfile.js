const gulp = require('gulp');
const del = require('del');
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect-php');
const {
  watch,
  series,
  parallel
} = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');

const paths = {
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'dist/scripts/',
    build: 'build/scripts/'
  },
  styles: {
    src: ['src/styles/*.scss', 'src/styles/*.min.css'],
    dest: 'dist/styles/',
    build: 'build/styles/'
  },
  html: {
    src: ['src/*.html', 'src/*.php'],
    dest: 'dist/',
    build: 'build/'
  },
  images: {
    src: 'src/images/*',
    dest: 'dist/images/',
    build: 'build/images/'
  }
};

const clean = () => del(['dist/*']);
const cleanBuild = () => del(['build/*']);

const server = browserSync.create();

function test(done) {
  console.log('Gulp is running');
  done()
}

function scripts() {
  return browserify({
    entries: './src/scripts/index.js',
    debug: true
  })
    .transform("babelify", {
      presets: ["@babel/preset-env"]
    })
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.scripts.dest))
}

function buildScripts() {
  return browserify({
    entries: './src/scripts/index.js'
  })
    .transform("babelify", {
      presets: ["@babel/preset-env"]
    })
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
}

function styles() {
  const plugins = [
    autoprefixer(),
    cssnano()
  ]
  return gulp.src(paths.styles.src, {
    sourcemaps: true
  })
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
}

function buildStyles() {
  const plugins = [
    autoprefixer(),
    cssnano()
  ]
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(paths.styles.dest));
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
}

function buildHtml() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
}

function images() {
  return gulp.src(paths.images.src, {
    sourcemaps: true
  })
    .pipe(gulp.dest(paths.images.dest));
}

function buildImages() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}


function reload(done) {
  server.reload();
  done();
}

function initServe(done) {
  connect.server({}, function () {
    server.init({
      server: 'dist'
    });
  })
  done();
}

function watchFiles() {
  watch('src/*.html', {
    usePolling: true
  }, gulp.series(html, reload));
  watch('src/styles/*.scss', {
    usePolling: true
  }, gulp.series(styles, reload));
  watch('src/scripts/*.js', {
    usePolling: true
  }, gulp.series(scripts, reload));
  watch('src/images/*', {
    usePolling: true
  }, gulp.series(images, reload));
}

exports.default = test;
exports.serve = gulp.series(clean, gulp.parallel(scripts, styles), gulp.parallel(html, images), initServe, watchFiles);
exports.build = gulp.series(cleanBuild, gulp.parallel(buildScripts, buildStyles), gulp.parallel(buildHtml, buildImages));