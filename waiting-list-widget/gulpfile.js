const fs = require('fs');
const util = require('util');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const posthtml = require('gulp-posthtml');
const webserver = require('gulp-webserver');
const { rollup } = require('rollup');

gulp.task('js', async function () {
  const bundle = await rollup({
    input: './src/scripts.js',
    context: 'window',
    plugins: [
      require('@rollup/plugin-node-resolve').nodeResolve({
        browser: true,
      }),
      require('rollup-plugin-terser').terser(),
    ],
  });

  if (!(await util.promisify(fs.exists)('./dist/'))) {
    await util.promisify(fs.mkdir)('./dist/');
  }

  return bundle.write({
    sourcemap: false,
    format: 'iife',
    file: './dist/bundle.js',
  });
});

gulp.task('css', function () {
  return gulp
    .src('./src/styles.css')
    .pipe(
      postcss(
        [
          require('tailwindcss'),
          require('autoprefixer'),
          require('cssnano')({
            preset: 'default',
          }),
        ],
        {
          map: false,
        },
      ),
    )
    .pipe(gulp.dest('./build'));
});

gulp.task('html', function () {
  return gulp
    .src('./src/widget.html')
    .pipe(
      posthtml(
        [
          require('htmlnano')({
            minifySvg: {
              plugins: [{ removeViewBox: false }],
            },
          }),
        ],
        {},
      ),
    )
    .pipe(gulp.dest('./build'));
});

gulp.task('final', async function () {
  const css = await util.promisify(fs.readFile)('./build/styles.css');
  const html = await util.promisify(fs.readFile)('./build/widget.html');
  const final = `<style>${css}</style>${html}`;
  if (!(await util.promisify(fs.exists)('./dist/'))) {
    await util.promisify(fs.mkdir)('./dist/');
  }
  await util.promisify(fs.writeFile)('./dist/final.html', final, 'utf8');
});

gulp.task('dev', async function () {
  const js = await util.promisify(fs.readFile)('./dist/bundle.js');
  const html = await util.promisify(fs.readFile)('./dist/final.html');
  const dev = `<body x-data="window.LANDING_PAGE_MODEL" x-init="init()">${html}</body><script>${js}</script>`;
  await util.promisify(fs.writeFile)('./index.html', dev, 'utf8');
});

gulp.task('serve', function () {
  gulp.src('.').pipe(
    webserver({
      livereload: true,
      directoryListing: true,
      open: true,
    }),
  );
});

gulp.task('watch', function () {
  gulp.watch('./src/scripts.js', gulp.series('js', 'dev'));
  gulp.watch('./src/styles.css', gulp.series(gulp.parallel('css', 'html'), 'final', 'dev'));
  gulp.watch('./src/widget.html', gulp.series(gulp.parallel('css', 'html'), 'final', 'dev'));
});

gulp.task('build', gulp.series(gulp.parallel('html', 'css', 'js'), 'final'));
