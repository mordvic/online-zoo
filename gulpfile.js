const {series, parallel, src, dest, watch} = require("gulp");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const webpack = require("webpack-stream");
const del = require("del");
const fileInclude = require('gulp-file-include');

const dist = "./dist/"

const browserReload = () => {
  console.log("dima")
  return browserSync.reload();
}

// const cleanHtml = (done) => {
//   del("./dist/*.html");
//   done();
// }

const copyIndexHTML = () => {
  return src("src/pages/landing/*.html")
  .pipe(fileInclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(dest(`${dist}`))
  .pipe(browserSync.stream());
}

const copyHTMLPages = () => {
  return src(["src/pages/**/*.html","!src/pages/landing/**"])
  // .pipe(fileInclude({
  //   prefix: '@@',
  //   basepath: '@file'
  // }))
  .pipe(dest(`${dist}/pages`))
  .pipe(browserSync.stream());
};

const copyAssets = () => {
  return src("./src/assets/**")
  .pipe(dest(dist + "/assets/"));
};
//
const transpilerScssToCss = () => {
  return src("./src/**/*.scss")
  .pipe(sourcemaps.init())
  .pipe(sass(
    {
      outputStyle: "expanded",
      errorLogToConsole: true,
    })
  )
  .pipe(
    autoprefixer({
      cascade: false,
    })
  )
  .pipe(sourcemaps.write("."))
  .pipe(dest("./dist/"))
  .pipe(browserSync.stream());
}

// const buildJS = () => {
//   return src('src/js/main.js')
//   .pipe(webpack({
//     mode: 'development',
//     output: {
//       filename: 'bundle.js'
//     },
//     watch: false,
//     devtool: "source-map",
//     module: {
//       rules: [
//         {
//           test: /\.m?js$/,
//           exclude: /(node_modules|bower_components)/,
//           use: {
//             loader: 'babel-loader',
//             options: {
//               presets: [['@babel/preset-env', {
//                 debug: true,
//                 corejs: 3,
//                 useBuiltIns: "usage"
//               }]]
//             }
//           }
//         }
//       ]
//     }
//   }))
//   .pipe(dest(dist));
// };

const browser = () => {
  browserSync.init({
    server: {
      baseDir: `${dist}`,
      port: 3000,
      host: "192.168.0.107",
      notify: true,
    }
  });

  watch("./src/pages/landing/*.html", series(copyIndexHTML));
  watch("./src/pages/**/*.html", series(copyHTMLPages));
  watch("./src/assets/**", series(copyAssets));
  watch("./src/style/**/*.*", series(transpilerScssToCss));
  // watch("./src/js/**/*.js", series(buildJS));
}

exports.default = series(copyIndexHTML, copyHTMLPages, transpilerScssToCss, copyAssets, browser);

