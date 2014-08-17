gulp = require("gulp")
plumber = require("gulp-plumber")

coffee = require("gulp-coffee")
header = require("gulp-header")

paths =
  coffee: './source/**/*.coffee'
  test: './test/test-*.coffee' # Change this back to test-*.coffee
  anytest: './test/*.coffee'

gulp.task "coffee", (cb) ->
  gulp.src(paths.coffee)
    .pipe(plumber())
    .pipe(coffee(bare: true))
    .pipe(header("// Dragoman translator by Michiel Dral \n"))
    .pipe(gulp.dest('./build/'))
    .on "end", ->
      console.log "Done compiling Coffeescript!"

# Rerun the task when a file changes
gulp.task "watch", ->
  gulp.watch paths.coffee, ["coffee"]

gulp.task "default", [
  "coffee"
]
