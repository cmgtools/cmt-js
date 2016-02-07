module.exports = function( grunt ) {

 	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        concat: {
      		options: {
        		separator: '\n\n',
				banner: '/**\n * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
			            '\n * Description: CMGTools JS is a JavaScript library which provide utilities, ui components and MVC framework implementation for CMSGears.' +
			            '\n * License: <%= pkg.license %>' +
			            '\n * Author: <%= pkg.author %>' +
			            '\n */\n\n'
      		},
      		dist: {
        		src: [ 'src/core/main.js', 'src/core/utils/main.js', 'src/core/utils/browser.js', 'src/core/utils/data.js', 'src/core/utils/image.js', 'src/core/utils/object.js', 'src/core/utils/ui.js', 'src/core/utils/fixes.js',
						'src/components/**/*.js',
						'src/mvc/core.js', 'src/mvc/application.js', 'src/mvc/controllers/main.js', 'src/mvc/controllers/BaseController.js', 'src/mvc/controllers/DefaultController.js' ],
        		dest: 'dist/cmgtools.js'
      		}
    	},
    	uglify: {
			options: {
				banner: '/**\n * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
			            '\n * Description: CMGTools JS is a JavaScript library which provide utilities, ui components and MVC framework implementation for CMSGears.' +
			            '\n * License: <%= pkg.license %>' +
			            '\n * Author: <%= pkg.author %>' +
			            '\n */\n\n'
			},
      		main_target: {
	        	files: {
	          		'dist/cmgtools.min.js': [ 'dist/cmgtools.js' ]
	        	}
      		}
    	},
		copy: {
			main: {
				files: [
					{ expand: true, cwd: 'dist/', src: ['*.js'], dest: 'examples/scripts/', filter: 'isFile' }
				]
			}
		}
    });

    grunt.registerTask( 'default', [ 'concat', 'uglify', 'copy' ] );
};