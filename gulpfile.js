var gulp = require('gulp'),
		jshint = require('gulp-jshint'),
		webpack = require('gulp-webpack'),
		uglify = require('gulp-uglify'),
		minifyCss = require('gulp-minify-css'),
		clean = require('gulp-clean'),
		concat = require('gulp-concat'),
		connect = require('gulp-connect'),
		proxy = require('http-proxy-middleware'),
		rename = require('gulp-rename'),
		webpackConfig = require('./webpack.config.js');

var path = '/dist'   //打包后的输出路径

gulp.task('lint', function  () {
		return  gulp.src('./js/*.js')
				.pipe(jshint())
				.pipe(jshint.reporter('default'));
});

gulp.task('init',function () {
		return gulp.src(['./js/jquery.js', './js/menu.js'])
				.pipe(gulp.dest( path + '/js/'));
});

gulp.task('copy', function  () {
		return gulp.src('./lib/layer/**/*')
				.pipe(gulp.dest(path + '/src/'));
});

gulp.task('concat', function  () {
		return gulp.src(['./js/underscore.js','./js/backbone.js', './js/ie8fileLoader.js', './js/ajaxBackboneManger.js'])
				.pipe(concat('./backboneTools.js'))
				.pipe(gulp.dest(path + '/js/'));
});


gulp.task('server', function() {
		return connect.server({
				root: ['.', './dist/'],
				port: 8080,
				livereload: true,
				middleware: function() {
						return [
								proxy('**/*.do',{
										target: 'http://183.3.205.120:88/spsy-croptrade-mgr/',
										changeOrigin: true
								}),
								proxy('**/*.json',{
										target: 'http://183.3.205.120:88/spsy-croptrade-mgr/',
										changeOrigin: true
								})
						]
				}
		});
});

/*main*/
gulp.task('jsMove',function () {
		return gulp.src(['./js/config.js', './js/menu.js'])
				.pipe(gulp.dest(path + '/js'));
});


gulp.task('htmlMove',function () {
		return gulp.src('./index.html')
				.pipe(gulp.dest(path));
});

gulp.task('webpack', function() {
		console.log('start.......')
		return gulp.src('./js/main.js')
				.pipe(webpack(webpackConfig))
				.pipe(gulp.dest(path + '/js'))
				.pipe(connect.reload());
});

gulp.task('watch', function () {
		gulp.watch('js/*.js', ['jsMove', 'webpack']);
		gulp.watch('js/*.css', ['cssMove', 'webpack']);
		gulp.watch('modules/**', ['webpack']);
});


gulp.task('clean', function() {
		return gulp.src(path)
				.pipe(clean({force: true}));
});
gulp.task('build',['init', 'concat', 'webpack', 'htmlMove', 'jsMove'], function() {
		/*gulp.src(['./js/ie8fileLoader.js',path + '/js/common.js'])
			.pipe(concat('./common.js'))
			.pipe(gulp.dest(path +'/js'));
			*/
		gulp.src(path + '/js/*.css')
				.pipe(minifyCss())
				.pipe(gulp.dest(path + '/js'));

		gulp.src(path + '/js/*.js')
				.pipe(uglify())
				.pipe(gulp.dest(path + '/js'));
});
gulp.task('default', ['clean'], function(){
		return gulp.start('init', 'concat', 'webpack', 'htmlMove', 'jsMove', 'server', 'watch');
});