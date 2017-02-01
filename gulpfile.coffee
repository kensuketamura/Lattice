gulp = require 'gulp'
$ = do require 'gulp-load-plugins'
browserSync = require 'browser-sync'
__srcdir = './src/'
__distdir = './dist/'

gulp.task 'jade', () ->
  gulp.src __srcdir + 'index.jade'
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.jade(
      pretty: true
    )
    .pipe gulp.dest(__distdir)

gulp.task 'es6', () ->
  gulp.src __srcdir + 'js/*.js'
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.babel(
      presets: ['es2015']
    )
    .pipe gulp.dest(__distdir + 'js')

gulp.task 'less', () ->
  gulp.src __srcdir + 'less/*.less'
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.less()
    .pipe gulp.dest(__distdir + 'css')

gulp.task 'reload', () ->
  browserSync.reload()

gulp.task 'browser-sync', () ->
  browserSync.init(
    "server" :
      "baseDir" : __distdir,
      "index" : "index.html"
  )

gulp.task 'watch', ['browser-sync', 'jade', 'es6', 'less'], () ->
  gulp.watch __srcdir + '**/*.jade', ['jade']
  gulp.watch __srcdir + 'less/*.less', ['less']
  gulp.watch __srcdir + 'js/*.js', ['es6']
  gulp.watch __distdir + "**/*", ['reload']

gulp.task 'default', ['watch']
