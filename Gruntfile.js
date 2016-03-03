module.exports = function (grunt) {

	var config_file_path = './config/grunt.yaml';

	var config = grunt.file.readYAML(config_file_path);
	var consts = {};
	consts.tmp_dir = './web/src/_tmp';
	consts.tmp_dir_js = consts.tmp_dir + '/js';
	consts.tmp_dir_css = consts.tmp_dir + '/css';
	consts.build_dist_path = config.dev.build.path+'/'+config.dev.build.dist_dir_name;
	consts.version_file = "version.php";

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
					options: {
						sourceMap: true
					},
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
					src: [config.dev.typescript.dir+"/**/*.ts"],
					dest: config.dev.typescript.output,
					options: {
						module: 'amd', //or commonjs
						target: 'es5', //or es3
						sourceMap: true,
						declaration: false,
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
					dest: consts.build_dist_path+'/js/scripts.js'
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
						{expand: true, cwd: './web/src/', src: ['img/**'], dest: consts.build_dist_path+'/'},
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
						livereload: config.dev.livereload.port,
					},
				},
				sass: {
					files: [config.dev.sass.dir + "/**/*.sass", config.dev.sass.dir + "/**/*.scss"],
					tasks: ["sass:dev"],
					options: {
						livereload: config.dev.livereload.port,
					},
				},
				ts: {
					files: [config.dev.typescript.dir + "/**/*.ts"],
					tasks: ["typescript:dev"],
					options: {
						livereload: config.dev.livereload.port,
					},
				},
				html: {
					files: ["./web/src/**/*.html"],
					options: {
						livereload: config.dev.livereload.port,
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
		var livereload_port = Math.floor(Math.random() * 7000) + 6000;
		var server_port = Math.floor(Math.random() * 7000) + 6000;
		config_content = config_content.replace('{{server_port}}', server_port);
		config_content = config_content.replace('{{livereload_port}}', livereload_port);
		grunt.file.write(config_file, config_content);

		var html_file = config.dev.livereload.livereload_file;
		var html_content = grunt.file.read(html_file);
		html_content = html_content.replace('{{livereload_port}}', livereload_port);
		grunt.file.write(html_file, html_content);
	});

	grunt.registerTask('init', [
		'shell:bower',
		'setup:config',
		'less:dev',
		'sass:dev',
		'typescript:dev'
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
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks("grunt-open");

	grunt.registerTask('default', 'watch');

	//not yet //grunt.registerTask('build', ['build:prepare', 'build:js', 'build:css', 'copy:prod', 'build:clean']);

}
;