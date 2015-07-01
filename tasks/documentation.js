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
var escape = require('escape-html');
var fs = require('fs');
var handlebars = require('Handlebars');
var path = require('path');

var fns = require('./functions.js');

var docs_data = {};

gulp.task('documentation', ['utils:code', 'documentation:js', 'documentation:css', 'documentation:assets', 'documentation:html']);

/* HTML */

// clean
gulp.task('documentation:clean:html', function() {
    var deletedFiles = del.sync(['dist/documentation/*.html']);
    return util.log('Files deleted:', deletedFiles);
});

gulp.task('documentation:clean:js', function() {
    var deletedFiles = del.sync(['dist/documentation/*.js']);
    return util.log('Files deleted:', deletedFiles);
});

gulp.task('documentation:clean:css', function() {
    var deletedFiles = del.sync(['dist/documentation/*.css']);
    return util.log('Files deleted:', deletedFiles);
});

gulp.task('documentation:clean:assets', function() {
    var deletedFiles = del.sync(['dist/documentation/assets/**/*.*']);
    return util.log('Files deleted:', deletedFiles);
});

// compile html
gulp.task('documentation:html', ['documentation:clean:html', 'component:partials'], function() {
    return gulp.src('src/documentation/[^_]*.hbs')
        .pipe(debug({
            title: 'documentation:html'
        }))
        .pipe(data(function(file) {
            var fileContents = file.contents.toString();
            var template = handlebars.compile(fileContents);
            file.contents = new Buffer(template(docs_data));
        }))
        .pipe(rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest('dist/documentation'));
});


/* JAVASCRIPT */

gulp.task('documentation:js', ['documentation:clean:js'], function() {
    return gulp.src([
            'src/documentation/_*.js',
            'src/documentation/docs.js'
        ])
        .pipe(concat('docs.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('dist/documentation/'));
});


/* CSS */

gulp.task('documentation:css', ['documentation:clean:css'], function() {
    return gulp.src(['src/documentation/docs_base.scss', 'src/documentation/_*.scss'])
        .pipe(concat('docs.css'))
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/documentation/'));
});


/* ASSETS */

gulp.task('documentation:assets', ['documentation:clean:assets'], function() {
    return gulp.src('src/documentation/assets/**/*.*')
        .pipe(gulp.dest('dist/documentation/assets'));
});


/* UTILS */

// generate code
gulp.task('utils:code', ['component:partials', 'documentation:js'], function() {
    var code = {};
    var jsContent = fs.readFileSync('dist/documentation/docs.js', {
        encoding: 'utf8'
    });
    var index = jsContent.indexOf('/* Components */');
    jsContent = jsContent.slice(index + 16);
    var matches = jsContent.match(/\/\* (.*?) \*\//g);
    if (matches) {
        for (var i = 0; i < matches.length; i++) {
            var id = matches[i].match(/\/\* (.*?) \*\//)[1];
            var curr = jsContent.indexOf(matches[i]) + matches[i].length;
            var next = jsContent.length;
            if (i < matches.length - 1) {
                next = jsContent.indexOf(matches[i + 1]);
            }
            code[id] = jsContent.slice(curr, next).replace(/^\s+|\s+$/g, '');
        }
    }
    return fs.writeFileSync('dist/documentation/code.js', 'var code = ' + JSON.stringify(code) + ';');
});