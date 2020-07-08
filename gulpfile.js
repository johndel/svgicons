const gulp = require('gulp')
const rename = require('gulp-rename')
const iconfont = require('gulp-iconfont')
const consolidate = require('gulp-consolidate')

const timestamp = Math.round(Date.now()/1000);

const fontName = 'collab_icons';
const className = 'colla'
const template = 'fontawesome-style';

const fontsPath = 'app/assets/fonts';
const iconsPath = 'app/assets/icons';

gulp.task('iconfont', function(){
  return gulp.src([`${iconsPath}/*.svg`])
      .pipe(iconfont({
        fontName,
        normalize: true,
        formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
        timestamp
      }))
      .on('glyphs', (glyphs) => {
        const options = {
          className,
          fontName,
          fontPath: '', // set path to font (from your CSS file if relative)
          glyphs: glyphs.map(mapGlyphs)
        }
        gulp.src(`${iconsPath}/templates/${template}.css`)
            .pipe(consolidate('lodash', options))
            .pipe(rename({ basename: fontName, extname: '.scss' }))
            .pipe(gulp.dest('app/assets/stylesheets')) // set path to export your CSS

        // if you don't need sample.html, remove next 4 lines
        gulp.src(`${iconsPath}/templates/${template}.html`)
            .pipe(consolidate('lodash', options))
            .pipe(rename({ basename: 'sample' }))
            .pipe(gulp.dest(fontsPath)) // set path to export your sample HTML
      })
      .pipe(gulp.dest(fontsPath)) // set path to export your fonts
});

/**
 * This is needed for mapping glyphs and codepoints.
 */
function mapGlyphs (glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}
