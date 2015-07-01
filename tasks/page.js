var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var buffer = require('gulp-buffer');
var concat = require('gulp-concat');
var data = require('gulp-data');
var debug = require('gulp-debug');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var util = require('gulp-util');

var del = require("del");
var handlebars = require('Handlebars');
var path = require('path');

gulp.task('page', ['page:html', 'page:css', 'page:js', 'page:assets', 'page:index']);

/* HTML */

// clean
gulp.task('page:clean:html', function() {
    var deletedFiles = del.sync(['dist/pages/*.html']);
    return util.log('Files deleted:', deletedFiles);
});

gulp.task('page:clean:js', function() {
    var deletedFiles = del.sync(['dist/pages/js/*.js']);
    return util.log('Files deleted:', deletedFiles);
});

gulp.task('page:clean:css', function() {
    var deletedFiles = del.sync(['dist/pages/**/*.css']);
    return util.log('Files deleted:', deletedFiles);
});

gulp.task('page:clean:assets', function() {
    var deletedFiles = del.sync(['dist/pages/assets/*.*']);
    return util.log('Files deleted:', deletedFiles);
});

// register partials
gulp.task('page:partials', ['component:partials'], function() {
    return gulp.src(['src/pages/**/_*.hbs'])
        .pipe(debug({
            title: 'register:partials'
        }))
        .pipe(data(function(file) {
            var id = path.basename(file.path, '.hbs');
            var fileContents = file.contents.toString();
            handlebars.registerPartial(id, fileContents);
        }));
});

// HTML
gulp.task('page:html', ['page:clean:html', 'page:partials'], function() {
    return gulp.src('src/pages/**/[^_]*.hbs')
        .pipe(debug({
            title: 'page:html'
        }))
        .pipe(data(function(file) {
            var fileContents = file.contents.toString();
            var template = handlebars.compile(fileContents);
            file.contents = new Buffer(template({}));
        }))
        .pipe(rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest('dist/pages'));
});

// JS
gulp.task('page:js', ['page:clean:js'], function() {
    return gulp.src([
            'src/pages/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('dist/pages/js/'))
});

// CSS
gulp.task('page:css', ['page:clean:css'], function() {
    return gulp.src(['src/pages/_app.scss', 'src/pages/[^_]*.scss'])
        .pipe(concat('app.css'))
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/pages/'));
});


/* ASSETS */
gulp.task('page:assets', ['page:clean:assets'], function() {
    return gulp.src(['src/pages/assets/**/*.*'])
        .pipe(gulp.dest('dist/pages/assets/'))
});

/* INDEX */
gulp.task('page:index', function() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist/'));
});