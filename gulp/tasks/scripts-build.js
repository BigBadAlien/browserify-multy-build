var gulp = require("gulp");
var babelify = require("babelify");
var sourcemaps = require("gulp-sourcemaps");
var gutil = require("gulp-util");
var handleErrors = require("../utils/handleErrors.js");
var browserify = require("browserify");
var eventStream = require("event-stream");
var glob = require("glob");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var watchify = require("watchify");

var SRC_PATH = "./src";
var BUILD_PATH = "./build";

var bundle = function (bundler, entryFilepath) {
  console.log(`Build: ${entryFilepath} to ${entryFilepath.replace(SRC_PATH, BUILD_PATH)}`);

  return bundler.bundle()
    .on("error", handleErrors)
    .pipe(source(entryFilepath.replace(SRC_PATH, BUILD_PATH)))
    .pipe(buffer())
    .on("error", handleErrors)
    .pipe(
      process.env.TYPE === "development" ?
        sourcemaps.init({loadMaps: true}) :
        gutil.noop()
    )
    .on("error", handleErrors)
    .pipe(
      process.env.TYPE === "development" ?
        sourcemaps.write() :
        gutil.noop()
    )
    .on("error", handleErrors)
    .pipe(gulp.dest("."))
    .on("error", handleErrors);
};

var buildScripts = function (done, watch) {
  glob(`${SRC_PATH}/**/[A-Z]*.js`, function (err, files) {
    if (err) {
      done(err);
    }

    var tasks = files.map(function (entryFilepath) {
      var bundler = browserify({
        entries: [entryFilepath],
        debug: process.env.TYPE === "development",
        plugin: watch ? [watchify] : undefined
      })
        .transform(
          babelify,
          {
            presets: ["es2015"]
          });

      var build = bundle.bind(this, bundler, entryFilepath);

      if (watch) {
        bundler.on("update", build);
      }

      return build();
    });

    return eventStream
      .merge(tasks)
      .on("end", done);
  });
};

gulp.task("scripts-build", function (done) {
  buildScripts(done);
});

gulp.task("scripts-watch", function (done) {
  buildScripts(done, true);
});
