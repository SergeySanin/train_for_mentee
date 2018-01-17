var gulp          = require('gulp'),
    less          = require('gulp-less'),
    browserSync   = require('browser-sync'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglifyjs'),
    cssnano       = require('gulp-cssnano'),
    rename        = require('gulp-rename'),
    del           = require('del'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    cache         = require('gulp-cache'),
    autoprefixer  = require('gulp-autoprefixer'),
    uncss         = require('gulp-uncss'),
    htmlmin       = require('gulp-htmlmin'),
    inlineCss     = require('gulp-inline-css');


/**************************Компиляция LESS*************************************/
gulp.task('less', function() {
  return gulp.src('app/less/main.less')
  .pipe(less())
  .pipe(autoprefixer( ['last 15 versions', 'ie 8', 'ie 7'], { cascad: true }))
  .pipe(uncss({
            html: ['index.html', 'app/**/*.html']
        }))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});


/**************************Сжатие JS*******************************************/
gulp.task('scripts', function() {
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/maginific-popup/dist/jquery.magnific-popup.min.js',
  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'));
});


/**************************Сжатие CSS*******************************************/
gulp.task('css-libs', ['less'], function(){
  return gulp.src(['app/css/main.css',
    'app/css/popup.css',])
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
});


/**************************Browser Sync****************************************/
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify:false
  });
});


gulp.task('clean', function(){
  return del.sync('dist/');
});

gulp.task('cleare', function(){
  return cache.clearAll();
});

/**************************Уменьшение изображений******************************/
gulp.task('img', function(){
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

/**************************Инлайн CSS******************************************/
/*gulp.task('inlineCss', function() {
    return gulp.src('app/*.html')
        .pipe(inlineCss({
	        	applyStyleTags: true,
	        	applyLinkTags: true,
	        	removeStyleTags: true,
	        	removeLinkTags: true
        }))
});*/

/**************************************Сжатие html******************************/
gulp.task('minify', function() {
  return gulp.src('app/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});


/*************************************WATCH************************************/
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
  gulp.watch('app/less/**/*.less', ['less']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});



/*************************************СБОРКА***********************************/
gulp.task('build', ['clean', 'img', 'less', 'scripts', 'minify'], function() {

  var buildCss = gulp.src([
    'app/css/main.css',
    'app/css/main.min.css',
  ])
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));

  var builJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'));

  /*var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));*/

});