var gulp = require('gulp');
var data = require('gulp-data');
var debug = require('gulp-debug');
var rename = require('gulp-rename');
var util = require('gulp-util');

var del = require("del");
var find = require('find');
var fs = require('fs');
var handlebars = require('Handlebars');
var path = require('path');

var fns = require('./functions.js');


/* HTML */

// clean
gulp.task('component:clean', function() {
    var deletedFiles = del.sync(['dist/components/']);
    return util.log('Files deleted:', deletedFiles);
});

// register partials
gulp.task('component:partials', function() {
    // add handlebar helper for parse JSON
    handlebars.registerHelper('parseJSON', function(data, options) {
        return options.fn(JSON.parse(data));
    });
    // add handlerbar helper for default JSON
    handlebars.registerHelper('parseDefaultJSON', function(data, options) {
        var file = find.fileSync(data + '.json', './src/components/')[0];
        var context = '';
        if (file) {
            context = fs.readFileSync(file, {
                encoding: 'utf8'
            });
        }
        return options.fn(JSON.parse(context));
    });
    // add handlebar compare method
    handlebars.registerHelper('compare', function(left, operator, right, options) {
        if (arguments.length < 3) {
            throw new Error('Handlebars Helper "compare" needs 2 parameters');
        }

        if (options === undefined) {
            options = right;
            right = operator;
            operator = '===';
        }

        var operators = {
            '==': function(l, r) {
                return l == r;
            },
            '===': function(l, r) {
                return l === r;
            },
            '!=': function(l, r) {
                return l != r;
            },
            '!==': function(l, r) {
                return l !== r;
            },
            '<': function(l, r) {
                return l < r;
            },
            '>': function(l, r) {
                return l > r;
            },
            '<=': function(l, r) {
                return l <= r;
            },
            '>=': function(l, r) {
                return l >= r;
            },
            'typeof': function(l, r) {
                return typeof l == r;
            }
        };

        if (!operators[operator]) {
            throw new Error('Handlebars Helper "compare" doesn\'t know the operator ' + operator);
        }

        var result = operators[operator](left, right);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    return gulp.src(['src/components/**/_*.hbs'])
        .pipe(debug({
            title: 'component:partials'
        }))
        .pipe(data(function(file) {
            var id = path.basename(file.path, '.hbs');
            var fileContents = file.contents.toString();
            handlebars.registerPartial(id, fileContents);
        }));
});

// build
gulp.task('component', ['component:clean', 'component:partials'], function() {
    var componentTemplate = fs.readFileSync('src/components/component.hbs', {
        encoding: 'utf8'
    });
    return gulp.src(['src/components/**/_*.hbs'])
        .pipe(debug({
            title: 'component'
        }))
        .pipe(data(function(file) {
            // add partials
            var id = path.basename(file.path, '.hbs');
            var componentPage = componentTemplate.replace('<!-- content -->', '{{> ' + id + '}}');

            // add title
            componentPage = componentPage.replace('<title>Component</title>', '<title>' + id.replace('_', ' ').trim().toUpperCase() + '</title>');

            // add content javascript
            var jsfilePath = file.path.replace('.hbs', '.js');
            if (fs.existsSync(jsfilePath)) {
                var jsString = fs.readFileSync(jsfilePath, {
                    encoding: 'utf8'
                });
                jsString = fns.grabContentFrom(jsString, 'component');
                componentPage = componentPage.replace('<!-- javascript -->', jsString);
            }

            // compile template
            var template = handlebars.compile(componentPage);
            var jsonData = {};
            // find data for hbs
            var jsonfilePath = file.path.replace('.hbs', '.json');
            if (fs.existsSync(jsonfilePath)) {
                var jsonfileString = fs.readFileSync(jsonfilePath, {
                    encoding: 'utf8'
                });
                jsonData = JSON.parse(jsonfileString);
            }
            // build template
            file.contents = new Buffer(template(jsonData));
        }))
        .pipe(rename(function(path) {
            path.dirname = '';
            path.basename = path.basename.slice(1);
            path.extname = '.html';
        }))
        .pipe(gulp.dest('dist/components'));
});