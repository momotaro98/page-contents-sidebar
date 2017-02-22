import gulp from 'gulp'
import {merge} from 'event-stream'
import map from 'map-stream'
const $ = require('gulp-load-plugins')();


// Tasks
gulp.task('clean', () => {
  return pipe('./tmp', $.clean());
});

gulp.task('build', (cb) => {
  $.runSequence('clean', 'style', 'template', 'js', 'devdist', cb);
});

gulp.task('default', ['build'], () => {
  gulp.watch(['./libs/**/*', './src/**/*'], ['default']);
});

gulp.task('style', () => {
  return pipe(
    './src/styles/mdisviewer.less',
    $.plumber(),
    $.less({relativeUrls: true}),
    $.autoprefixer({cascade: true}),
    './tmp'
  );
});

gulp.task('template', () => {
  const LOTS_OF_SPACES = new Array(500).join(' ');

  return pipe(
    './src/template.html',
    $.replace('__SPACES__', LOTS_OF_SPACES),
    html2js('const TEMPLATE = \'$$\''),
    './tmp'
  );
});

gulp.task('js', ['template'], () => {
  const src = [
    './tmp/template.js',
    './src/constants.js',
    './src/adapters/adapter.js',
    './src/adapters/gistmd.js',
    './src/view.index.js',
    './src/util.async.js',
    './src/util.storage.js'
  ].concat(['./src/config/overrides.js'])
   .concat('./src/mdisviewer.js');

  return pipe(
    src,
    $.babel(),
    $.concat('mdisviewer.js'),
    './tmp'
  );
});

gulp.task('devdist', ['js'], () => {
  return merge(
    pipe('./icons/**/*', './tmp/app/icons'),
    pipe(['./libs/**/*', './tmp/mdisviewer.*', './src/config/manifest.json'], './tmp/app/'),
    pipe('./src/config/background.js', $.babel(), './tmp/app/')
  );
});

// Helpers
function pipe(src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === 'string';
    return stream.pipe(isDest ? gulp.dest(transform) : transform);
  }, gulp.src(src));
}

function html2js(template) {
  return map(escape);

  function escape(file, cb) {
    const path = $.util.replaceExtension(file.path, '.js');
    const content = file.contents.toString();
    const escaped = content
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/\r?\n/g, "\\n' +\n    '");
    const body = template.replace('$$', escaped);

    file.path = path;
    file.contents = new Buffer(body);
    cb(null, file);
  }
}
