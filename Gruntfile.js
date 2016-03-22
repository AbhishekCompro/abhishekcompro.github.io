'use strict';

module.exports = function(grunt) {
    // Grunt project configuration.
    grunt.initConfig({
		// Task configuration.
        
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),  
		
		// Connect on port 9001
        connect: {
            dev: {
                options: {
                    port: 9001,
                    hostname: '0.0.0.0',
                    keepalive: true,
                    base: '..'
                }
            }
        }

	});
	
	grunt.loadNpmTasks('grunt-contrib-connect');
	
	// Default task
	grunt.registerTask('default', [ 
        'connect'
    ]);  

};
