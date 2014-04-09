(function() {
    'use strict';
    
    var gulp        = require('gulp'),
        minifyCSS   = require('gulp-minify-css'),
        uglify      = require('gulp-uglify'),
        rename      = require('gulp-rename'),
                
        SUFFIX      = '.min';
        
    
    gulp.task('css', function() {
        gulp.src('menu.css')
            .pipe(minifyCSS())
            .pipe(rename({
                suffix: SUFFIX
            }))
            .pipe(gulp.dest('./'))
            .on('error', onError);
    });
    
    gulp.task('js', function() {
      gulp.src('menu.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: SUFFIX
        }))
        .pipe(gulp.dest('./'))
        .on('error', onError);
    });
    
    gulp.task('default', ['css', 'js']);
    
    function onError(params) {
        console.log(params.message);
    }
    
})();
