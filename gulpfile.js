const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const gulpSass = require("gulp-sass")(require("sass"));
const fileinclude = require("gulp-file-include");
// const connect = require("gulp-connect");

function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    port: 4000,
    notify: false,
    open: true,
  });
  cb();
}

function init(cb) {
  gulp
    .src(["./src/assets/bootstrap-5.3.3/**/*"])
    .pipe(gulp.dest("./dist/assets/bootstrap/"))
    .pipe(browserSync.stream());
  cb();
}

function html(cb) {
  gulp
    .src(["./src/html/*.html", "./src/html/*/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("./dist/"))
    .on("end", browserSync.reload);
  cb();
}

function js(cb) {
  gulp
    .src(["src/assets/js/app.js"])
    .pipe(concat("app.min.js"))
    .pipe(gulp.dest("dist/assets/js/"))
    .on("end", browserSync.reload);
  cb();
}

function scss(cb) {
  gulp
    .src("src/assets/scss/app.scss")
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(concat("app.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("dist/assets/css/"))
    .pipe(browserSync.stream());
  cb();
}

function copyscss(cb) {
  gulp.src(["./src/assets/scss/**/*"]).pipe(gulp.dest("./dist/assets/scss/"));
  cb();
}

function imageprocess(cb) {
 return gulp
    .src("./src/assets/img/**/*", { encoding: false })
    .pipe(gulp.dest("./dist/assets/img/"))
    .pipe(browserSync.stream());
  cb();
}

// function fonts(cb) {
//   gulp
//     .src("src/assets/fonts/**/*")
//     .pipe(gulp.dest("dist/assets/fonts/"))
//     .pipe(connect.reload());
//   cb();
// }

function watch(cb) {
  gulp.watch("./src/html/**/*.html", html);
  gulp.watch("./src/assets/js/*.js", js);
  gulp.watch("./src/assets/scss/**/*.scss", gulp.series(scss, copyscss));
  gulp.watch("./src/assets/img/**/*", imageprocess);
  // gulp.watch("./src/assets/fonts/**/*", fonts);
  cb();
}

function service(cb) {
  gulp.series(browserSyncServe, watch)();
  cb();
}

exports.default = gulp.series(
  init,
  gulp.parallel(html, js, scss, copyscss, imageprocess),
  service
);
exports.build = gulp.series(
  init,
  gulp.parallel(html, js, scss, copyscss, imageprocess)
);
exports.service = gulp.series(init, browserSyncServe, watch);
