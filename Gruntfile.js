module.exports = function(grunt) {

    var buildConfig = grunt.option('config') || 'debug';
    var outputDir = '';

    require('load-grunt-tasks')(grunt);

    switch(buildConfig){
        case 'debug':
            outputDir = "build/debug";
            break;
        case 'release':
            outputDir = 'build/release';
            break;
        default:
            grunt.fatal('invalid build config');
            break;
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        config: {
            outputDir: outputDir,
            buildConfig: buildConfig
        },

        includeFiles: {
            js: {
                app: [
                    'src/app/module.js',

                    'src/app/engine/module.js',
                    'src/app/engine/*.js',

                    'src/app/controllers/module.js',
                    'src/app/controllers/*.js'
                ]
            }
        },

        concat: {
            dist: {
                src: ['<%= includeFiles.js.app %>'],
                dest: '<%= config.outputDir %>/_tmp/lizardhitter.js'
            }
        },

        copy: {
            app: {
                files: [{
                        expand: true,
                        dest: '<%= config.outputDir %>',
                        cwd: 'src/',
                        src: ['**/*.html', '**/*.css', 'vendor/**/*.js', 'favicon.png']
                    }
                ]
            },
            tmp: {
                files: [{
                    expand: true,
                    dest: '<%= config.outputDir %>/js',
                    cwd: '<%= config.outputDir %>/_tmp',
                    src: ['lizardhitter.js']
                }]
            }
        },

        uglify: {
            js: {
                files: {
                    '<%= config.outputDir %>/js/lizardhitter.js': ['<%= config.outputDir %>/_tmp/lizardhitter.js']
                }
            }
        },

        clean: {
            all: {
                src: ['build/**']
            },
            app: {
                src: '<%= config.outputDir %>/**'
            },
            tmp: {
                src: '<%= config.outputDir %>/_tmp'
            }
        }
    });

    var buildTask = ['concat', 'copy:app'];
    if( grunt.config('config').buildConfig === 'release' ){
        buildTask.push('uglify');
    }
    else {
        buildTask.push('copy:tmp');
    }
    buildTask.push('clean:tmp');

    grunt.registerTask('build', buildTask);

    grunt.registerTask('default', ['build']);
};