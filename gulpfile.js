const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const cp = require('child_process');
const jade = require('gulp-jade');

// Jekyll 빌드
function jekyllBuild(done) {
    browserSync.notify('Running: Jekyll Build');
    return cp.spawn('jekyll', ['build'], { stdio: 'inherit' }).on('close', done);
}

// 브라우저 싱크 설정
function browserSyncServe(done) {
    browserSync.init({
        server: {
            baseDir: '_site',
        },
    });
    done();
}

// SASS 컴파일
function sassCompile() {
    return gulp
        .src('assets/css/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.stream())
        .pipe(gulp.dest('assets/css'));
}

// Jade 컴파일
function jadeCompile() {
    return gulp.src('_jadefiles/*.jade').pipe(jade()).pipe(gulp.dest('_includes'));
}

// 파일 변경 감지
function watch() {
    gulp.watch('assets/css/**', sassCompile);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], gulp.series(jekyllBuild, browserSync.reload));
    gulp.watch('_jadefiles/*.jade', jadeCompile);
}

// 기본 태스크
exports.default = gulp.series(sassCompile, jekyllBuild, browserSyncServe, watch);
