var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var buffer = require('gulp-buffer');
var concat = require('gulp-concat');
var data = require('gulp-data');
var declare = require('gulp-declare');
var debug = require('gulp-debug');
var filterby = require('gulp-filter-by');
var hb = require('gulp-handlebars');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var wrap = require('gulp-wrap');

var fs = require('fs');
var del = require('del');
var path = require('path');

var fns = require('./functions.js');

gulp.task('library', ['js', 'css', 'template', 'images', 'fonts']);

/* JAVASCRIPTS */

// clean
gulp.task('clean:js', function() {
    var deletedFiles = del.sync(['dist/js']);
    return util.log('Files deleted:', deletedFiles);
});

// compile hbs into runtime template for dynamic data loading
gulp.task('template', function() {
    return gulp.src('src/components/**/_*.hbs')
        .pipe(debug({
            title: 'template'
        }))
        .pipe(filterby(function(file) {
            // find json file
            var jsonfilePath = file.path.replace('.hbs', '.json');
            return fs.existsSync(jsonfilePath);
        }))
        .pipe(rename(function(path) {
            path.basename = path.basename.slice(1);
        }))
        .pipe(hb())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'templates',
            noRedeclare: true, // Avoid duplicate declarations
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('dist/js'));
});

// sample data
gulp.task('sample', function() {
    return gulp.src(['src/js/samples.js', 'src/components/**/_*.js'])
        .pipe(debug({
            title: 'sample'
        }))
        .pipe(data(function(file) {
            var basename = path.basename(file.path, '.js');
            if (basename === 'samples') {
                return file;
            }
            var id = basename.slice(1);
            var fileContents = file.contents.toString();
            var sample = fns.grabContentFrom(fileContents, 'sample');
            if (sample === undefined) {
                sample = '';
            }
            file.contents = new Buffer(sample);
            return file;
        }))
        .pipe(concat('samples.js'))
        .pipe(gulp.dest('dist/js'));
});

// copy
gulp.task('js:copy', ['clean:js'], function() {
    return gulp.src(['src/js/libs/*.js'])
        .pipe(gulp.dest('dist/js/libs/'));
});

// build
gulp.task('js', ['js:copy', 'sample', 'template'], function() {
    return gulp.src([
            'src/js/app.js',
            'src/components/**/_*.js'
        ])
        .pipe(data(function(file) {
            var fileContents = file.contents.toString();
            var js = fns.grabContentFrom(fileContents, 'js');
            file.contents = new Buffer(js);
            return file;
        }))
        .pipe(concat('app.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('dist/js/'));
});


/* CSS */

// clean
gulp.task('clean:css', function() {
    var deletedFiles = del.sync(['dist/css']);
    return util.log('Files deleted:', deletedFiles);
});

// build
gulp.task('css', ['clean:css'], function() {
    return gulp.src(['src/css/_base.scss', 'src/components/**/_*.scss'])
        .pipe(concat('style.scss'))
        .pipe(gulp.dest('src/css'))
        // .pipe(sourcemaps.init()) // initialize sourcemaps
        .pipe(sass({
            errLogToConsole: true
        })) // compile scss to css
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })) // autoprefix for browser differences
        // // .pipe(sourcemaps.write()) // write sourcemaps
        .pipe(gulp.dest('dist/css/'));
});


/* IMAGES */

// clean
gulp.task('clean:images', function() {
    var deletedFiles = del.sync(['dist/images/*.*']);
    return util.log('Files deleted:', deletedFiles);
});

// copy
gulp.task('images', ['clean:images'], function() {
    return gulp.src('src/images/*.*')
        .pipe(gulp.dest('dist/images'))
});


/* FONTS */

// clean
gulp.task('clean:fonts', function() {
    var deletedFiles = del.sync(['dist/fonts/*.*']);
    return util.log('Files deleted:', deletedFiles);
});

// copy
gulp.task('fonts', ['clean:fonts'], function() {
    return gulp.src(['src/fonts/**/*.*'])
        .pipe(gulp.dest('dist/fonts'))
});


/* TEST */

gulp.task('test', function() {
    return gulp.src(['src/components/elements/_dropdown.js'])
        .pipe(data(function(file) {
            var fileContents = file.contents.toString();
            var result = fns.grabContentFrom(fileContents, 'sample');
            util.log(result);
            return file;
        }))
});