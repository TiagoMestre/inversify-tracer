'use strict';

const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

const config = {
	mocha: {
		ui: 'bdd',
		reporter: 'mochawesome',
		reporterOptions: {
			reportDir: 'reports/mochawesome'
		}
	}
};

module.exports = function (gulp) {

	gulp.task('test', ['test:istanbul'], function () {
		return gulp
			.src('coverage/result.json')
			.pipe(remapIstanbul({
				reports: {
					'html': 'reports/coverage',
					'lcovonly': 'coverage/lcov.info'
				}
			}));
	});

	gulp.task('test:mocha', function () {
		return gulp.src('lib/tests/**/*.js').pipe(mocha(config.mocha))
	});

	gulp.task('pre-test', function () {
		return gulp
			.src('lib/src/**/*.js')
			.pipe(istanbul())
			.pipe(istanbul.hookRequire());
	});

	gulp.task('test:istanbul', ['pre-test'], function () {
		return gulp
			.src('lib/tests/**/*.js')
			.pipe(mocha(config.mocha))
			.pipe(istanbul.writeReports({
				reporters: ['json','text-summary'],
				reportOpts: {
					json: { file: 'coverage/result.json'}
				}
			}));
	});
};