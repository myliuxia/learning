
var gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'));
// const concat = require('gulp-concat'); // 代码合并
const jshint = require('gulp-jshint');  // js代码规范检测
const imagemin = require('gulp-imagemin');

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist/'))
})
gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(gulp.dest('dist/js/'))
})
gulp.task('scss', function () {
  return gulp.src('src/style/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/style/'))
})
gulp.task('image', function () {
  return gulp.src('src/image/*.{png,jpg,gif,ico}')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/image/'))
})

gulp.task('build', gulp.parallel('scss', 'js', 'html', 'image', async () => {
  await console.log('build success')
}))
