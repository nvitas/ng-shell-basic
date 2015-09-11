/*
 *  HOW THE BUILD FILE WORKS:
 *
 *  #1)  Copy the app/scripts file to 'appCopy' temporary directory
 *  #2)  Do all the replacements necessary in the source code of the 'appCopy' directory (I.E. @@version, @@systemVersion)
 *         - this is necessary as concatenation and uglification must be applied AFTER any replacements in the source code
 *  #3)  Copy the whole 'app' directory to 'dist' directory
 *  #4)  minify the CSS files and send the minified files directly to 'dist' directory
 *  #5)  concat js files (for both 'app/scripts' and 'app/login/scripts'), create source maps for each, and store in '.tmp' folder
 *         - when concatenating 'app/scripts' folder use the 'appCopy/app/scripts' as they have the necessary source code replacements (step #2)
 *         - when concatenating 'app/login/scripts' folder use the 'app/login/scripts' - no source code replacements there...yet
 *  #6)  uglify 'build.min.js' and 'login.min.js' from the '.tmp' directory, create uglified source maps and send to 'dist' folder
 *  #7)  create the ngTemplates (cached version of all the .html files in 'app/views' folder) and send to 'dist'
 *  #8)  'processhtml' - remove all the individual javascript/css files in the index.html & login.html and replace them with respective minified versions
 *  #9)  'filerev & userev' - add a cache busting hash to minified files (I.E. 'build.min.a6hn42m8m.js') and update index.html and login.html with new file names
 *  #10) replace (development) vendor files with their minified (prod) versions (I.E. angular.js -> angular.min.js) in index.html file
 *  #11) replace @@timestamp and @@version in index.html & login.html files
 *  #12) compress - create tar package artifact
 *  #13) clean all created directories: 'appCopy', '.tmp' and 'dist'
 *
 * */

module.exports = function (grunt) {
	var gruntOptions =
	{
		pkg : grunt.file.readJSON('package.json'),
		clean : {
			dist : "dist/",
			tmp : ".tmp",
			appCopy : "appCopy"
		},
		// Copies remaining files not concatenated
		copy : {
			appCopy : {
				files : [
					{
						expand : true,
						dest : 'appCopy/',
						src : [
							'app/scripts/**',
						]
					}
				]
			},
			dist : {
				files : [
					{
						expand : true,
						dest : 'dist/',
						src : [
							'app/*',
							'test/**',
							'app/vendor/**',
							'app/images/**',
							'app/sounds/**',
							'app/i18n/**',
						]
					}
				]
			}
		},
		cssmin : {
			options : {
				shorthandCompacting : false,
				roundingPrecision : -1
			},
			target : {
				files : {
					'dist/app/styles/layout.min.css' : ['app/styles/**/*.css'],
					'dist/app/styles/directives.min.css' : ['app/directives/**/*.css']
				}
			}
		},
		concat : {
			options : {
				separator : ';',
				sourceMap : true
			},
			main : {
				src : ['appCopy/app/scripts/**/*.js'],
				dest : '.tmp/main/build.js'
			},
			directives : {
				src : ['app/directives/**/*.js'],
				dest : '.tmp/main/directives.js'
			}
		},
		uglify : {
			main : {
				options : {
					sourceMap : true,
					sourceMapIncludeSources : true,
					sourceMapIn : '.tmp/main/build.js.map',
					sourceMapName : 'dist/app/scripts/maps/build.js.map'
				},
				files : {
					'dist/app/scripts/build.min.js' : '.tmp/main/build.js'
				}
			},
			directives : {
				options : {
					sourceMap : true,
					sourceMapIncludeSources : true,
					sourceMapIn : '.tmp/main/directives.js.map',
					sourceMapName : 'dist/app/scripts/maps/directives.js.map'
				},
				files : {
					'dist/app/scripts/directives.min.js' : '.tmp/main/directives.js'
				}
			}
		},
		ngtemplates : {
			app : {
				cwd : 'app',
				src : [
					'views/**/*.html',
					'directives/**/*.html',
				],
				dest : 'dist/app/scripts/ngTemplates.min.js',
				options : {
					module : 'app',
					htmlmin : {
						collapseWhitespace : true,
						collapseBooleanAttributes : true,
						removeComments : true, // Only if you don't use comment directives!
						removeRedundantAttributes : true
					}
				}
			}
		},
		processhtml : {
			options : {
				data : {
					minifiedBuildFile : 'scripts/build.min.js',
					minifiedDirectivesFile : 'scripts/directives.min.js',
					ngTemplatesFile : 'scripts/ngTemplates.min.js',
					minifiedLayoutCSSFile : 'styles/layout.min.css',
					minifiedDirectivesCSSFile : 'styles/directives.min.css'
				}
			},
			dist : {
				files : {
					'dist/app/index.html' : ['app/index.html']
				}
			}
		},
		filerev : {
			options : {
				encoding : 'utf8',
				algorithm : 'md5',
				length : 8
			},
			index : {
				src : ['dist/app/scripts/*.js', 'dist/app/styles/*.css']
			}
		},
		userev : {
			options : {
				hash : /(\.[a-f0-9]{8})\.[a-z]+$/
			},
			login : {
				src : ['dist/app/index.html'],
				options : {
					patterns : {
						'Layout CSS File' : /layout.min.css/,
						'Rev Build File' : /build.min.js/,
						'Rev JS Templates' : /ngTemplates.min.js/,
						'Rev Directives File' : /directives.min.js/,
						'Rev Directives CSS File' : /directives.min.css/,
					}
				}
			}
		},
		replace : {
			preConcat : {
				options : {
					patterns : [
						{
							match : 'buildName',
							replacement : '<%= buildName %>',
							expression : false
						},
						{
							match : 'buildNumber',
							replacement : '<%= buildNumber %>',
							expression : false
						}
					]
				},
				files : [
					{src : 'appCopy/app/scripts/util/logger.js', dest : 'appCopy/app/scripts/util/logger.js'},
				]
			},
			withMinifiedFiles : {
				options : {
					patterns : [
						{
							match : /angular.js/g,
							replacement : 'angular.min.js'
						},
						{
							match : /angular-route.js/g,
							replacement : 'angular-route.min.js'
						},
						{
							match : /angular-cookies.js/g,
							replacement : 'angular-cookies.min.js'
						},
						{
							match : /angular-sanitize.js/g,
							replacement : 'angular-sanitize.min.js'
						},
						{
							match : /angular-touch.js/g,
							replacement : 'angular-touch.min.js'
						},
						{
							match : /tmhDynamicLocale.js/g,
							replacement : 'tmhDynamicLocale.min.js'
						},
					]
				},
				files : [
					{src : 'dist/app/index.html', dest : 'dist/app/index.html'},
				]
			},
			timeStamp : {
				options : {
					patterns : [
						{
							match : 'buildName',
							replacement : '<%= buildName %>',
							expression : false
						},
						{
							match : 'buildNumber',
							replacement : '<%= buildNumber %>',
							expression : false
						},
						{
							match : 'timestamp',
							replacement : '<%= grunt.template.today() %>',
							expression : false
						}
					]
				},
				files : [
					{src : 'dist/app/index.html', dest : 'dist/app/index.html'},
				]
			}
		},
		jshint : {
			options : {
				bitwise : false, // Supress warning of bitwise operations.
				globalstrict : true, // Make sure strict is declared at top of files.
				indent : 4,
				proto : true, // Supress warnings about __proto__ property.
				//newcap: true,
				sub : true,
				//camelcase: false,
				quotmark : 'single',
				curly : true,
				//forin: true,
				//immed: true,
				latedef : false,
				//undef: true,
				//unused: true,
				eqnull : true,
				eqeqeq : false,
				"-W041" : false, // disable eqeqeq
				"-W030" : false, // disable expression checking for (?:)
				globals : {
					'$' : true,
					'_' : true,
					'angular' : true,
					'util' : true,
					'mPulseApp' : true,
					'Logger' : true,
					'mixpanel' : true,
					'IScroll' : true,
					'Chart' : true,
					'alert' : true,
					'window' : true,
					'document' : true,
					'localStorage' : true,
					'navigator' : true,
					'confirm' : true,
					'io' : true,
					'setTimeout' : true,
					'setInterval' : true,
					'clearInterval' : true,
					'escape' : true,
					'console' : true,
					'Raphael' : true,
					'webkitAudioContext' : true,
					'XMLHttpRequest' : true,
					'witechAppSettings' : true,
					'globalLog' : true,
					'platform' : true,
					'btoa' : true,
					'Base64' : true,
					'moment' : true,
					'Bugsnag' : true
				}
			},
			files : {
				src : [
					'app/scripts/*.js',
					'app/scripts/util/*.js',
					'app/scripts/services/*.js',
					'app/scripts/services/configuration/*.js',
					'app/scripts/model/*.js',
					'app/scripts/filters/*.js',
					'app/scripts/directives/*.js',
					'app/scripts/controllers/*.js',
					'app/scripts/controllers/**/*.js',
					'app/scripts/controllers/**/**/*.js',
					'app/scripts/controllers/**/**/**/*.js',
					'app/scripts/controllers/**/**/**/**/*.js'
				]
			}
		}
	};

	if (process.env.BUILD_NUMBER) {
		gruntOptions.buildName = process.env.BUILD_DISPLAY_NAME;
		gruntOptions.buildNumber = process.env.BUILD_NUMBER;
	}

	grunt.initConfig(gruntOptions);

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-userev');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['build']);
	grunt.registerTask('lint', ['jshint']);
	//grunt.registerTask('clean', ['clean']);
	grunt.registerTask('build', [
		'clean',
		'copy:appCopy',
		'copy:dist',
		'cssmin',
		'concat',
		'uglify',
		'ngtemplates',
		'processhtml',
		'filerev',
		'userev',
		'replace:timeStamp',
		'clean:tmp',
		'clean:appCopy',
		//'clean:dist',
	]);
};
