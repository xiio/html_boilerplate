module.exports = function (grunt) {

	var config_file_path = './config/grunt.yaml';
	var config = grunt.file.readYAML(config_file_path);
	var consts = {};
	consts.tmp_dir = './web/src/_tmp';
	consts.tmp_dir_js = consts.tmp_dir + '/js';
	consts.tmp_dir_css = consts.tmp_dir + '/css';
	consts.version_file = "version.php";

	consts.livereload_port = Math.floor(Math.random() * 8000) + 7000;

	var getServerUrl = function (env) {
		var config = grunt.file.read(config_file_path);
		var re = /base_url:([\s\S]*?[\n])/g;
		var url = re.exec(config)[1];
		return url.replace('http://', '').trim();
	};

	// Project configuration.
	grunt.initConfig({

			/****************************
			 * LESS
			 ****************************/
			less: {
				dev: {
					options: {
						paths: [config.dev.less.dir],
						yuicompress: false,
						sourceMap: true,
						sourceMapRootpath: '/'
					},
					// target name
					files: [{
						// no need for files, the config below should work
						expand: true,
						cwd: config.dev.less.dir,
						src: ["*.less"],
						dest: config.dev.less.output,
						ext: ".css"
					}]
				},
			},

			/****************************
			 * SASS
			 ****************************/
			sass: {
				dev: {
					files: [{
						expand: true,
						cwd: config.dev.sass.dir,
						src: ['*.scss','*.sass'],
						dest: config.dev.sass.output,
						ext: '.css'
					}]
				},
			},

			/****************************
			 * TYPESCRIPT
			 ****************************/
			typescript: {
				dev: {
					src: [config.dev.typescript.dir],
					dest: config.dev.typescript.output,
					options: {
						module: 'amd', //or commonjs
						target: 'es5', //or es3
						basePath: config.dev.typescript.basePath,
						sourceMap: true,
						declaration: true,
						noResolve: true
					}
				}
			},

			/****************************
			 * UGLIFY
			 ****************************/
			uglify: {
				prod: {
					options: {
						preserveComments: false
					},
					src: consts.tmp_dir_js + '/*.js',
					dest: './web/dist/js/scripts.js'
				}
			},

			/****************************
			 * CSSMIN
			 ****************************/
			cssmin: {
				prod: {
					options: {
						keepSpecialComments: 0
					},
					files: {
						'./web/dist/css/styles.css': [consts.tmp_dir_css + '/*.css']
					}
				}
			},

			/****************************
			 * COPY
			 ****************************/
			copy: {
				prod: {
					files: [
						{expand: true, cwd: './web/src/', src: ['img/**'], dest: './web/dist/'},
						// makes all src relative to cwd
						//{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
						// flattens results to a single level
						//{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
					]
				}
			},

			/****************************
			 * SHELL
			 ****************************/
			shell: {
				bower: {
					command: 'bower install'
				},
				project_up: {
					command: function () {
						var host = config.dev.server.host;
						grunt.log.ok('Server started: http://' + host);
						grunt.event.emit('serverListening'); // triggers open:delayed
						return 'cd web & '+config.dev.php.executable+' -S ' + host;
					},
					stdout: true
				},
			},

			/****************************
			 * CONCURRENT
			 ****************************/
			concurrent: {
				app_up: {
					tasks: ['shell:project_up', 'watch', 'open:browser'],
					options: {
						logConcurrentOutput: true
					}
				}
			},

			/****************************
			 * OPEN
			 ****************************/
			open: {
				browser: {
					path: 'http://' + config.dev.server.host,
					options: {
						delay: 100
					}
				}
			},

			/****************************
			 * WATCH
			 ****************************/
			watch: {
				css: {
					files: [config.dev.less.dir + "/**/*.less"],
					tasks: ["less:dev"],
					options: {
						livereload: consts.livereload_port,
					},
				},
				//soon
				//sass: {
				//	files: [config.dev.sass.dir + "/**/*.sass"],
				//	tasks: ["sass:dev"],
				//	options: {
				//		livereload: consts.livereload_port,
				//	},
				//},
				ts: {
					files: [config.dev.typescript.dir + "/**/*.ts"],
					tasks: ["typescript:dev"],
					options: {
						livereload: consts.livereload_port,
					},
				},
				twig: {
					files: ["./web/src/**/*.html"],
					options: {
						livereload: consts.livereload_port,
					},
				},
			}
			,

		}
	)
	;

	grunt.registerTask('setup:config', 'Setup configuration.', function () {
		var config_file = config_file_path;
		var config_content = grunt.file.read(config_file);
		config_content = config_content.replace('{{port}}', Math.floor(Math.random() * 7000) + 6000);
		grunt.file.write(config_file, config_content);
	});

	grunt.registerTask('init', [
		'shell:bower',
		'setup:config'
	]);

	grunt.registerTask('up', [
		'concurrent:app_up'
	]);

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-contrib-livereload");
	//soon //grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks("grunt-open");

	grunt.registerTask('default', 'watch');

	//not yet //grunt.registerTask('build', ['build:prepare', 'build:js', 'build:css', 'copy:prod', 'build:clean']);

}
;