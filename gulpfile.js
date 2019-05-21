// "use strict";

var 	syntax        = 'sass'; // Syntax: sass or scss;

var gulp        = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		pug 		  		= require('gulp-pug'),
		fileinclude   = require('gulp-file-include');
		// rsync         = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist' //папка котороую ослеживает, до этого была app
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	// return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	return gulp.src('src/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 5 versions']))
	// .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('dist/css')) // папака в которую складывают уже готовые css стили
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		// 'app/libs/jquery/dist/jquery.min.js',
		'src/libs/common.js', // Always at the end
		])
	// .pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('dist/js')) // папака в которую складывают уже готовые js файлы
	.pipe(browserSync.reload({ stream: true }))
});

// gulp.task('code', function() {
// 	return gulp.src('src/htmlinclude/*.html')
// 	.pipe(browserSync.reload({ stream: true }))
// });


////////////////////////////////////////////////////////////
// fileinclude
////////////////////////////////////////////////////////////

// gulp.task('fileinclude', async function() {
// 	gulp.src(['src/htmlinclude/index.html'])
// 		// .pipe(browserSync.reload({ stream: true }))
//     .pipe(fileinclude({
// 		prefix: '@@',
// 		basepath: '@file'
// 		}))		
// 		.pipe(gulp.dest('./dist'))
// });

gulp.task('pug', function(){
    return gulp.src(['src/pug/*.pug','!src/pug/_layouts/*.*'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}))
});




	gulp.task('watch', function() {
		// gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
		gulp.watch('src/sass/**/*.sass', gulp.parallel('styles'));

		// gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
		gulp.watch(['src/libs/**/*.js', 'src/libs/common.js'], gulp.parallel('scripts'));

		// gulp.watch('app/index/index.html', gulp.parallel('fileinclude'));
		gulp.watch('src/pug/**/*.pug', gulp.parallel('pug'));
		// gulp.watch('src/htmlinclude/*.html', gulp.parallel('fileinclude'));
		// gulp.watch('src/htmlinclude/*.html', gulp.parallel('code'))
	});
	gulp.task('default', gulp.parallel('styles', 'pug', 'scripts', 'browser-sync', 'watch'));