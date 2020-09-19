'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify-es').default;
var imagemin = require('gulp-imagemin');
var htmlreplace = require('gulp-html-replace');
var templateCache = require('gulp-angular-templatecache');

var paths = {
    sass: ['./scss/**/*.scss'],
    scripts: [
        // './www/js/*.js',
        // './www/js/**/*.js',
        // './www/js/**/**/*.js',
        './www/js/app.js',
        './www/js/controllers.js',
        './www/js/controllers/*.js',
        './www/js/controllers/**/*.js',
        './www/js/services.js',
        './www/js/ngservices/*.js',
        './www/js/directives.js',
        './www/js/directives/*.js',
        './www/js/directives/**/*.js',
        './www/js/translation/*.js',
        './www/js/constants.js',
        './www/js/main.js',
        '!./www/js/app.bundle.min.js'
    ],
    images: ['./www/images/**/*'],
    templates: [
        './www/templates/*.html',
        './www/templates/**/*.html'
    ],
    css: [
        './www/css/style.css',
        './www/css/main.css',
        './www/css/override.css',
        './www/css/common.css',
        './www/css/mediaqueries.css',
    ],
    html: ['./www/index.html'],
    certificates: ['./www/certificates/*'],
    fonts: ['./www/fonts/**/*'],
    lib: ['./www/lib/**/*'
    ],
    dist: ['./dist/']
};
var files = {
    jsbundle: 'app.bundle.min.js',
    appcss: 'app.min.css'
};

gulp.task('default');

// gulp.task('build', ['scripts', 'styles', 'imagemin', 'index', 'copy']);
gulp.task('build', ['scripts', 'styles', 'index', 'copy']);

gulp.task('clean', function() {
    return gulp.src(paths.dist, {
        read: false
    })
        .pipe(clean());
});

gulp.task('index', ['clean'], function() {
    gulp.src(paths.html)
        .pipe(htmlreplace({
            'css': 'css/app.min.css',
            'js': 'js/app.bundle.min.js',
            'templates': 'js/templates.js'
        }))
        .pipe(gulp.dest(paths.dist + '.'));
});

gulp.task('scripts', ['clean', 'templateCache'], function() {
    gulp.src(paths.scripts)
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(uglify())
        .pipe(concat(files.jsbundle))
        .pipe(gulp.dest(paths.dist + 'js'));
});

gulp.task('templateCache', ['clean'], function() {
    return gulp.src(paths.templates)
        .pipe(templateCache({
            'filename': 'templates.js',
            'root': 'templates/',
            'module': 'kkapp'
        }))
        .pipe(gulp.dest(paths.dist + 'js'));
});

gulp.task('copy', ['clean'], function() {

    // Copy lib scripts
    gulp.src(paths.lib)
        .pipe(gulp.dest(paths.dist + 'lib'));

    // Copy certificates files
    gulp.src(paths.certificates)
        .pipe(gulp.dest(paths.dist + './certificates'));

    // Copy fonts files
    gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.dist + './fonts'));

    // Copy images files
    gulp.src(['./www/images/*'])
        .pipe(gulp.dest(paths.dist + './images'));

    // Copy images files
    gulp.src(['./www/images/bank/*'])
        .pipe(gulp.dest(paths.dist + './images/bank'));

    // Copy fonts files
    gulp.src(['./www/images/icon/**/*'])
        .pipe(gulp.dest(paths.dist + './images/icon'));

});

gulp.task('styles', ['clean'], function() {
    gulp.src(paths.css)
        .pipe(minifyCss())
        .pipe(concat(files.appcss))
        .pipe(gulp.dest(paths.dist + 'css'));
});

// gulp.task('imagemin', ['clean'], function() {
//     gulp.src(paths.images)
//         .pipe(imagemin())
//         .pipe(gulp.dest(paths.dist + 'images'));
// });
