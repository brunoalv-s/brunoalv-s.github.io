var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var pug         = require('gulp-pug');
var jade        = require('gulp-jade');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll.bat', ['build'])
        .on('close', done);
});

// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['sass', 'jade','sassjobs', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// SASS/SCSS to CSS in _site
gulp.task('sass', function() {
  return gulp.src('assets/sass/**.{sass,scss}')
    .pipe(sass({ onError: browserSync.notify }))
    .pipe(prefix({ browsers: ['last 2 versions'], }))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({stream:true}))
});

// SASS/SCSS for Jobs pages
gulp.task('sassjobs', function() {
  return gulp.src('jobs/css/**.{sass,scss}')
    .pipe(sass({ onError: browserSync.notify }))
    .pipe(prefix({ browsers: ['last 2 versions'], }))
    .pipe(gulp.dest('jobs/css'))
    .pipe(browserSync.reload({stream:true}))
});


// Travis building a gulp task for jade
gulp.task('jade', function(){
    return gulp.src('_jadefiles/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('_includes'));
});

// Watch scss files for changes & recompile. Watch html/md files, run jekyll & reload BrowserSync
gulp.task('watch', function () {
    gulp.watch('assets/sass/**/*.{sass,scss}', ['sass']);
    gulp.watch('_jadefiles/*.jade', ['jade']);
    gulp.watch('jobs/css/**/*.{sass,scss}', ['sassjobs']);
    gulp.watch(['index.html', '_layouts/*.html', '_posts/*', '_includes/*', 'assets/css/*.css', 'jobs/*.html', 'jobs/css/*.css'], ['jekyll-rebuild']);
});

// Default task, running just `gulp` will compile the sass, jade, compile the jekyll site, launch BrowserSync & watch files.
gulp.task('default', ['browser-sync', 'watch']);
