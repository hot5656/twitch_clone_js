const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const autoprefixer = require('autoprefixer');
const minimist = require('minimist'); // 用來讀取指令轉成變數
// add third js module
const gulpSequence = require('gulp-sequence').use(gulp);
// add webpack-stream
const webpack = require('webpack-stream');

// env process
// production || development
// # gulp --env production
const envOptions = {
  string: 'env',
  default: { env: 'development' },
};

var options = minimist(process.argv.slice(2), envOptions);
console.log(options);
// --- env process

// load browser-sync
gulp.task('browserSync', () => {
  browserSync.init({
    server: { baseDir: './public' },
    reloadDebounce: 2000,
  });
});

// use ejs - not copy html
// copy file to public (not include sass,ejs and html)
// gulp.task('copy', () => {
//   gulp
//     .src(['./source/**/**', '!source/sass/**/**', '!source/**/*.ejs', '!source/**/*.html'])
//     .pipe(gulp.dest('./public/'))
//     .pipe(
//       browserSync.reload({
//         stream: true,
//       }),
//     );
// });

// no use ejs - copy html
// copy file to public (not include sass)
// gulp.task('copy', () => {
//   gulp
//     .src(['./source/**/**', '!source/sass/**/**'])
//     .pipe(gulp.dest('./public/'))
//     .pipe(
//       browserSync.reload({
//         stream: true,
//       }),
//     );
// });
// add webpack-streamwebpack-stream
gulp.task('copy', () => {
  gulp
    .src(['./source/**/**', '!source/sass/**/**', '!source/js/**/**'])
    .pipe(gulp.dest('./public/'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});

// sass process
gulp.task('sass', () => {
  // PostCSS AutoPrefixer
  const processors = [
    autoprefixer({
      browsers: ['last 5 version'],
    }),
  ];

  return gulp
    .src(['./source/sass/**/*.sass', './source/sass/**/*.scss'])
    .pipe($.wait(200))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass({
        outputStyle: 'nested',
        includePaths: ['./node_modules/susy/sass'],		// addition include sass
      }).on('error', $.sass.logError),
    )
    .pipe($.postcss(processors))
    .pipe($.if(options.env === 'production', $.cleanCss())) // 假設開發環境則壓縮 CSS
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});

// clear pubic file 
gulp.task('clean', () => {
  return gulp.src(['./public'], { read: false }).pipe($.clean());
});

// use ejs - need layout
// layout process
// gulp.task('layout', () => {
//   return gulp
//     .src(['./source/**/*.html'])
//     .pipe($.plumber())
//     .pipe($.frontMatter())  // 模板設置
//     .pipe(
//       $.layout((file) => {  // ejs 模板設置
//         return file.frontMatter;
//       }),
//     )
//     .pipe(gulp.dest('./public'))
//     .pipe(
//       browserSync.reload({
//         stream: true,
//       }),
//     );
// });

// use ejs - no watch .html and watch layout
// watch process
// gulp.task('watch', () => {
//   gulp.watch(['./source/**/**', '!source/sass/**/*.sass', '!source/sass/**/*.scss', '!source/**/*.ejs', '!source/**/*.html'], ['copy']);
//   gulp.watch(['./source/**/*.ejs', './source/**/*.html'], ['layout']);
//   gulp.watch(['./source/sass/**/*.sass', './source/sass/**/*.scss'], ['sass']);
// });

// no use ejs - no watch layout, watch .html
// watch process
// gulp.task('watch', () => {
//   gulp.watch(['./source/**/**', '!source/sass/**/*.sass', '!source/sass/**/*.scss'], ['copy']);
//   gulp.watch(['./source/sass/**/*.sass', './source/sass/**/*.scss'], ['sass']);
// });
// add webpack-stream
gulp.task('watch', () => {
  gulp.watch(['./source/**/**', '!source/sass/**/*.sass', '!source/sass/**/*.scss', '!source/js/**/*.js'], ['copy']);
  gulp.watch(['./source/sass/**/*.sass', './source/sass/**/*.scss'], ['sass']);
});


gulp.task('ghpage', () => {
  return gulp.src('./public/**/*').pipe($.ghPages());
});

// add third js module
gulp.task('vendorJs', () => {
  return gulp
    .src([
      './node_modules/jquery/dist/jquery.min.js'
    ])
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest('./public/js'));
});

// add webpack-stream
gulp.task('webpack', () => {
  return gulp
    .src('./source/js/all.js')
    .pipe(webpack( {
      watch: true,  // add watch
      mode: 'none', // add mode
      output: {
        filename: 'boundle.js'
      } ,
			module: {
				rules: [
						{
							use: {
								loader: 'babel-loader',
								options: {
								  presets: ['@babel/preset-env']
								}
							}
						}
				]
			}
    } ))
    .pipe(gulp.dest('./public/js'));
});

// use ejs - include layout
// gulp.task('default', ['copy', 'sass', 'layout', 'browserSync', 'watch']);

// no use ejs - no include layout
// gulp.task('default', ['copy', 'sass', 'browserSync', 'watch']);
// add third js module
// gulp.task('default', ['copy', 'sass', 'vendorJs', 'browserSync', 'watch']);
// add webpack-stream
gulp.task('default', ['copy', 'sass', 'webpack', 'browserSync', 'watch']);

// add build for re-build
// gulp.task('build', gulpSequence('clean', 'copy', 'sass'));
// add third js module
// gulp.task('build', gulpSequence('clean', 'copy', 'sass', 'vendorJs'));
gulp.task('build', gulpSequence('clean', 'copy', 'sass', 'webpack'));




