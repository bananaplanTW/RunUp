module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            route: {
                src: ['**/*.js']
            }
        },
        watch: {
            files: ['<% jshint.route.src %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['jshint']);
};