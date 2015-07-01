var gulp = require('gulp');
var requireDir = require('require-dir');
var browserSync = require('browser-sync');

var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

requireDir('./tasks');

gulp.task('default', ['library', 'component', 'documentation', 'page']);

gulp.task('watch', ['default'], function() {
    // libary
    gulp.watch(['src/js/**/*.js', 'src/components/**/_*.js'], ['js', 'component']);
    gulp.watch(['src/css/**/_*.*', 'src/components/**/_*.scss'], ['css']);
    gulp.watch(['src/fonts/**/*.*'], ['fonts']);
    gulp.watch(['src/images/**/*.*'], ['images']);
    // page
    gulp.watch(['src/pages/*.hbs'], ['page:html']);
    gulp.watch(['src/pages/*.js'], ['page:js']);
    gulp.watch(['src/pages/*.scss'], ['page:css']);
    gulp.watch(['src/pages/assets/**/*.*'], ['page:assets']);
    // documentation
    gulp.watch(['src/documentation/*.hbs', 'src/documentation/*.json'], ['documentation:html']);
    gulp.watch(['src/documentation/*.js'], ['documentation:js', 'utils:code']);
    gulp.watch(['src/documentation/*.scss'], ['documentation:css']);
    gulp.watch(['src/documentation/assets/*.*'], ['documentation:assets']);
    // component
    gulp.watch(['src/components/**/*.hbs', 'src/components/**/_*.json'], ['component', 'template', 'page:html']); //add page if needed
});

gulp.task('sync', ['default'], function() {
    browserSync({
        server: {
            baseDir: 'dist/'
        },
        reloadDebounce: 2000
    });
    // libary
    gulp.watch(['src/js/**/*.js', 'src/components/**/_*.js'], ['js', 'component', browserSync.reload]);
    gulp.watch(['src/css/**/*.*', 'src/components/**/_*.scss'], ['css', browserSync.reload]);
    gulp.watch(['src/fonts/**/*.*'], ['fonts', browserSync.reload]);
    gulp.watch(['src/images/**/*.*'], ['images', browserSync.reload]);
    // page
    gulp.watch(['src/pages/*.hbs'], ['page:html', browserSync.reload]);
    gulp.watch(['src/pages/*.js'], ['page:js', browserSync.reload]);
    gulp.watch(['src/pages/*.scss'], ['page:css', browserSync.reload]);
    gulp.watch(['src/pages/assets/**/*.*'], ['page:assets', browserSync.reload]);
    // documentation
    gulp.watch(['src/documentation/*.hbs', 'src/documentation/*.json'], ['documentation:html', browserSync.reload]);
    gulp.watch(['src/documentation/*.js'], ['documentation:js', 'utils:code', browserSync.reload]);
    gulp.watch(['src/documentation/*.scss'], ['documentation:css', browserSync.reload]);
    gulp.watch(['src/documentation/assets/*.*'], ['documentation:assets', browserSync.reload]);
    // component
    gulp.watch(['src/components/**/*.hbs', 'src/components/**/_*.json'], ['component', 'template', 'page:html', browserSync.reload]); //add page if needed
});

// minify both js and css
gulp.task('minify', function() {
    // js
    gulp.src('dist/js/*.js')
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
    // css
    gulp.src('dist/css/*.css')
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css/'));
});