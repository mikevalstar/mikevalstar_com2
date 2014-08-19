'use strict';
module.exports = function (grunt) {

    grunt.initConfig({

        connect: {
            server: {
                options: {
                    port: 4020,
                    base: './dist'
                }
            }
        },

        aws: grunt.file.readJSON('../grunt-aws.json'),

        s3: {
            options: {
                key: '<%= aws.key %>',
                secret: '<%= aws.secret %>',
                bucket: '<%= aws.bucket %>',
                access: 'public-read',
                headers: {
                    "Cache-Control": "max-age=60000, public",
                    //"Expires": new Date(Date.now() + 60000).toUTCString()
                }
            },
            live: {
                upload: [
                    {
                        src: 'dist/**/*',
                        dest: '',
                        rel: 'dist',
                        options: {
                            gzip: true
                        }
                    }
                ]
            }
        },

        execute: {
            target: {
                src: ['index.js']
            }
        },

        less: {
            dist: {
                files: {
                    'dist/css/site.css': ['less/site.less'],
                },
                options: {
                    compress: true,
                    sourceMap: true,
                    sourceMapFilename: 'dist/map/css.map',
                    sourceMapURL: '/map/css.map'
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/js/main.min.js': [
                        'javascript/*.js',
                        'javascript/**/*.js'
                    ]
                },
                options: {
                    sourceMap: 'dist/map/main.min.js.map',
                    sourceMapName: 'dist/map/main.min.js.map',
                    sourceMapIncludeSources: true,
                    mangle: false
                }
            }
        },

        watch: {

            options: {
                livereload: true
            },

            less: {
                files: ['less/**/*.less'],
                tasks: ['less']
            },

            js: {
                files: ['javascript/**/*.js'],
                tasks: ['uglify']
            },

            metalsmith: {
                files: ['src/**/*', 'templates/**/*'],
                tasks: ['execute', 'less', 'uglify']
            }

        },

        clean: {
            dist: [
                'dist/*'
            ]
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-metalsmith');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-s3');

    // Register tasks
    grunt.registerTask('default', [
        'clean', 'execute', 'less', 'uglify'
    ]);
};