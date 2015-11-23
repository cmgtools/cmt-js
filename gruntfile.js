module.exports = function( grunt ) {

 	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        concat: {
      		options: {
        		separator: ';',
				banner: '/**\n * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
			            '\n * Description: CMGTools JS is a JavaScript library which provide utilities, ui components and MVC framework implementation for CMSGears.' +
			            '\n * License: <%= pkg.license %>' +
			            '\n * Author: <%= pkg.author %>' +
			            '\n */\n'
      		},
      		dist: {
        		src: [ 'src/core/**/*.js', 'src/mvc/core.js', 'src/mvc/controllers.js', 'src/mvc/application.js', 'src/components/**/*.js' ],
        		dest: 'dist/cmgtools.js'
      		}
    	},
    	uglify: {
			options: {
				banner: '/**\n * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
			            '\n * Description: CMGTools JS is a JavaScript library which provide utilities, ui components and MVC framework implementation for CMSGears.' +
			            '\n * License: <%= pkg.license %>' +
			            '\n * Author: <%= pkg.author %>' +
			            '\n */\n'
			},
      		main_target: {
	        	files: {
	          		'dist/cmgtools.min.js': ['dist/cmgtools.js']
	        	}
      		}
    	}
    });

    grunt.registerTask( 'default', [ 'concat', 'uglify' ] );
};