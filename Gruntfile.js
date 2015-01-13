module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>-plugins <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'client/assets/plugins/enabled/dist/*.html',
                dest: 'client/assets/plugins/plugins_dist.html'
            }
        },
        replace: {
            example: {
                src: ['client/assets/plugins/enabled/*.html'],             // source files array (supports minimatch)
                dest: 'client/assets/plugins/enabled/dist/',             // destination directory or file
                replacements: [{
                    from: /<\/?script[^>]*>/g,                   // string replacement
                    to: ''
                }]
            }
        },
        wrap: {
            basic: {
                src: ['client/assets/plugins/plugins_dist.html'],
                dest: 'client/assets/plugins/plugins_dist.html',
                options: {
                    wrapper: ['<script>', '</script>']
                }
            }
        },
        clean: ["client/assets/plugins/enabled/dist/*.html"]
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'replace', 'uglify', 'wrap']);

};
