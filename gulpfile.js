"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var server = require("browser-sync").create();
var posthtml = require("gulp-posthtml");
var del = require("del");

gulp.task("clean", function () {   
  return del("build"); 
});

gulp.task("copy", function () { 
  return gulp.src([
    "fonts/**/*.{woff,woff2}",       
    "images/**", 
    "js/**"       
    ], {       
      base: "" 
    })     
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function () {
  return gulp.src("images/**/*.{png,jpg,svg}") 
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/images"));
});

gulp.task("html", function () { 
  return gulp.src("*.html")
    .pipe(posthtml([       
    ]))
    .pipe(gulp.dest("build")); 
});

gulp.task("server", function () {
  server.init({
    server: "build/",
  });

  gulp.watch("less/**/*.less", gulp.series("css"));
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("build", gulp.series(   
  "clean",   
  "copy",   
  "css",
  "html" 
));

gulp.task("start", gulp.series("build", "server"));