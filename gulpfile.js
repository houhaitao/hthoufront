var gulp = require('gulp'),
connect = require('gulp-connect'),
minifyCSS = require('gulp-minify-css'),
clean = require('gulp-clean'),
rename = require('gulp-rename'),
sourcemaps = require('gulp-sourcemaps'),
sass = require('gulp-sass'),
htmlreplace =  require('gulp-html-replace'),
uglify = require('gulp-uglify'),
concat = require('gulp-concat'),
autoprefixer = require('gulp-autoprefixer');
var exec = require('child_process').exec;

/*
var gulp = require('gulp'),
minifyCSS = require('gulp-minify-css'),
concatCss = require('gulp-concat-css'),
jshint = require('gulp-jshint'),
concat = require('gulp-concat'),
htmlreplace = require('gulp-html-replace'),
rename = require('gulp-rename'),
uglify = require('gulp-uglify'),
connect = require('gulp-connect'); */

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('clean', function() {
    return gulp.src('./dist', {read: false})
        .pipe(clean({force: true}));
});

gulp.task("itag", function(){
    exec('itag');
});

gulp.task('copy', ['clean', 'itag'], function() {

	gulp.src("./css/main.css")
		.pipe(minifyCSS())
		.pipe(gulp.dest('./dist/css'));

    gulp.src('./images/**')
        .pipe(gulp.dest('./dist/images'));

    gulp.src('./css/img/**')
        .pipe(gulp.dest('./dist/css/img'));

    gulp.src(['./js/respond.min.js', './js/jquery/jquery-1.8.3.min.js', './js/plugins.js'])
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

    gulp.src(['./js/**'])
        .pipe(gulp.dest('./dist/js'));

    gulp.src('./templates/**')
        .pipe(gulp.dest('./dist/templates'));

    gulp.src('./*.html')
        .pipe(htmlreplace({"remove":"", js: 'js/libs.js'}))
        .pipe(gulp.dest('./dist'));

    gulp.src('./css/font/*')
        .pipe(gulp.dest('./dist/css/font'));
});

gulp.task('connect', function() {
  connect.server({
    port: 9001,
    livereload: true
  });

   exec('start chrome http://localhost:9001');
});

gulp.task('server-dist', function() {
  connect.server({
	root: 'dist',
    port: 9002,
    livereload: true
  });

   var exec = require('child_process').exec;
   exec('start chrome http://localhost:9002');
});


gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

gulp.task('sass', function () {
    gulp.src('./sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:"expanded"}).on('error', sass.logError))
        .pipe(autoprefixer("> 0.1%"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());
});

gulp.task('dist',function(){
    gulp.run('copy');
});

gulp.task('css',function(){
    gulp.src('./css/*.css')
        .pipe(connect.reload());
});

gulp.task('font',function(){
    gulp.src('./sass/font/*')
        .pipe(gulp.dest('./css/font'));
});

gulp.task('img',function(){
    gulp.src('./sass/img/**')
        .pipe(gulp.dest('./css/img'));
});

gulp.task('itag', function(){
    var exec = require('child_process').exec;
    exec('itag');
})

gulp.task('watch', function () {
  gulp.watch(['*.html'], ['html']);
  gulp.watch(['css/*.css'], ['css']);
  gulp.watch(['sass/font/*'], ['font']);
  gulp.watch(['sass/img/**'], ['img']);
  gulp.watch(['sass/*.scss'], ['sass']);
  gulp.watch(['templates/*.html'], ['itag']);
});

gulp.task('default', ['connect', 'watch']);