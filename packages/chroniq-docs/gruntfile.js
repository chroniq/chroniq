module.exports = function(grunt) {

  var autoprefixer = require('autoprefixer')({
    browsers: [
      'Chrome >= 35',
      'Firefox >= 31',
      'Edge >= 12',
      'Explorer >= 10',
      'iOS >= 8',
      'Safari >= 8',
      'Android 2.3',
      'Android >= 4',
      'Opera >= 12'
    ]
  });
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    banner: '/*!\n' +
            ' * TheDocs v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the Themeforest Standard Licenses\n' +
            ' */\n',


    // Task configuration
    // -------------------------------------------------------------------------------


    // Complile SCSS
    sass: {

      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: {
          'src/assets/css/<%= pkg.name %>.min.css': 'src/assets/css/<%= pkg.name %>.scss',
          'src/assets/css/skin/skin-blue.min.css': 'src/assets/css/theDocs/skins/skin-blue.scss',
          'src/assets/css/skin/skin-brown.min.css': 'src/assets/css/theDocs/skins/skin-brown.scss',
          'src/assets/css/skin/skin-cyan.min.css': 'src/assets/css/theDocs/skins/skin-cyan.scss',
          'src/assets/css/skin/skin-dark.min.css': 'src/assets/css/theDocs/skins/skin-dark.scss',
          'src/assets/css/skin/skin-gray.min.css': 'src/assets/css/theDocs/skins/skin-gray.scss',
          'src/assets/css/skin/skin-green.min.css': 'src/assets/css/theDocs/skins/skin-green.scss',
          'src/assets/css/skin/skin-orange.min.css': 'src/assets/css/theDocs/skins/skin-orange.scss',
          'src/assets/css/skin/skin-pink.min.css': 'src/assets/css/theDocs/skins/skin-pink.scss',
          'src/assets/css/skin/skin-purple.min.css': 'src/assets/css/theDocs/skins/skin-purple.scss',
          'src/assets/css/skin/skin-red.min.css': 'src/assets/css/theDocs/skins/skin-red.scss',
          'src/assets/css/skin/skin-teal.min.css': 'src/assets/css/theDocs/skins/skin-teal.scss',
          'src/assets/css/skin/skin-yellow.min.css': 'src/assets/css/theDocs/skins/skin-yellow.scss'
        }
      },

      dev: {
        options: {
          sourceMap: true,
          outputStyle: 'expanded'
        },
        files: {
          'src/assets/css/<%= pkg.name %>.css': 'src/assets/css/<%= pkg.name %>.scss',
          'src/assets/css/skin/skin-blue.css': 'src/assets/css/theDocs/skins/skin-blue.scss',
          'src/assets/css/skin/skin-brown.css': 'src/assets/css/theDocs/skins/skin-brown.scss',
          'src/assets/css/skin/skin-cyan.css': 'src/assets/css/theDocs/skins/skin-cyan.scss',
          'src/assets/css/skin/skin-dark.css': 'src/assets/css/theDocs/skins/skin-dark.scss',
          'src/assets/css/skin/skin-gray.css': 'src/assets/css/theDocs/skins/skin-gray.scss',
          'src/assets/css/skin/skin-green.css': 'src/assets/css/theDocs/skins/skin-green.scss',
          'src/assets/css/skin/skin-orange.css': 'src/assets/css/theDocs/skins/skin-orange.scss',
          'src/assets/css/skin/skin-pink.css': 'src/assets/css/theDocs/skins/skin-pink.scss',
          'src/assets/css/skin/skin-purple.css': 'src/assets/css/theDocs/skins/skin-purple.scss',
          'src/assets/css/skin/skin-red.css': 'src/assets/css/theDocs/skins/skin-red.scss',
          'src/assets/css/skin/skin-teal.css': 'src/assets/css/theDocs/skins/skin-teal.scss',
          'src/assets/css/skin/skin-yellow.css': 'src/assets/css/theDocs/skins/skin-yellow.scss'
        }
      }
    },
    

    // Watch on SCSS files
    watch: {
      sass: {
        files: ['src/assets/css/**/*.scss'],
        tasks: ['sass:dev'],
      }
    },
    
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'src/assets/css/*.css',
            'src/*.html'
          ]
        },
        options: {
          watchTask: true,
          server: 'src'
        }
      }
    },

    // Clean files and directories
    clean: {
      options: {
        force: true
      },
      before_copy: ['dist'],
      after_copy: {
        src: ["dist/Starter-kit/*.html",
              "!dist/Starter-kit/layout_boxed*.html",
              "!dist/Starter-kit/layout_full*.html",
              "!dist/Starter-kit/layout_sidebar*.html",
              "!dist/Starter-kit/layout_single*.html",
              "dist/**/theDocs.js",
              "dist/**/theDocs.min.js",
              "dist/**/theDocs.css",
              "dist/**/theDocs.min.css",
              "dist/**/*.css.map",
              "dist/**/theDocs.scss",
              "dist/**/css/theDocs",
              "dist/**/vendors",
              "dist/Starter-kit/assets/css/custom.css",
              "dist/Starter-kit/assets/js/custom.js",
              "dist/Starter-kit/assets/img/*",
              "!dist/Starter-kit/assets/img/favicon*",
              "!dist/Starter-kit/assets/img/logo*",
              ],
      }
    },


    // Replace
    replace: {
      dist: {
        src: ['dist/Starter-kit/*.html', 'dist/Documentation/*.html'],
        overwrite: true,
        replacements: [{
          from: /    <link href="assets\/css\/theDocs\.css" rel="stylesheet">\n/g,
          to: ""
        },
        {
          from: /    <script src="assets\/js\/theDocs\.js"><\/script>\n/g,
          to: ""
        }]
      }
    },


    // Copy files
    copy: {
      dist: {
        files: [
          // dist folder
          {expand: true, cwd: 'src/', src: ['**'], dest: 'dist/Documentation'},
          {expand: true, cwd: 'src/', src: ['**'], dest: 'dist/Starter-kit'},

        ],
      },

      source: {
        files: [
          {expand: true, cwd: 'src/', src: ['**'], dest: 'dist/Source/src'},
          {expand: true, cwd: '.', src: ['package.json', 'gruntfile.js'], dest: 'dist/Source'},
          
        ]
      },

      dev: {
        files: [
          {expand: true, cwd: 'src/assets/vendors/bootstrap/fonts', src: ['**'], dest: 'src/assets/fonts/'},
          {expand: true, cwd: 'src/assets/vendors/font-awesome/fonts', src: ['**'], dest: 'src/assets/fonts/'}
        ]
      }
    },

    // Concat file to make theDocs.all
    concat: {
      dist: {
        files: {
          // Javascript
          // 
          
          // Starter-kit
          'dist/Starter-kit/assets/js/theDocs.all.js': [
            'src/assets/js/theDocs.all.min.js',
            'src/assets/js/theDocs.js'
          ],

          'dist/Starter-kit/assets/js/theDocs.all.min.js': [
            'src/assets/js/theDocs.all.min.js',
            'src/assets/js/theDocs.min.js'
          ],

          // Documentation
          'dist/Documentation/assets/js/theDocs.all.js': [
            'src/assets/js/theDocs.all.min.js',
            'src/assets/js/theDocs.js'
          ],

          'dist/Documentation/assets/js/theDocs.all.min.js': [
            'src/assets/js/theDocs.all.min.js',
            'src/assets/js/theDocs.min.js'
          ],

          // CSS
          // 
          
          // Starter-kit
          'dist/Starter-kit/assets/css/theDocs.all.css': [
            'src/assets/css/theDocs.all.min.css',
            'src/assets/css/theDocs.css'
          ],

          'dist/Starter-kit/assets/css/theDocs.all.min.css': [
            'src/assets/css/theDocs.all.min.css',
            'src/assets/css/theDocs.min.css'
          ],

          // Documentation
          'dist/Documentation/assets/css/theDocs.all.css': [
            'src/assets/css/theDocs.all.min.css',
            'src/assets/css/theDocs.css'
          ],

          'dist/Documentation/assets/css/theDocs.all.min.css': [
            'src/assets/css/theDocs.all.min.css',
            'src/assets/css/theDocs.min.css'
          ]
        },
      },

      dev: {
        files: {
          // Javascript
          'src/assets/js/theDocs.all.min.js': [
            'src/assets/vendors/jquery/jquery.min.js',
            'src/assets/vendors/bootstrap/js/bootstrap.min.js',
            'src/assets/vendors/prism/prism.js',
            'src/assets/vendors/perfect-scrollbar/js/perfect-scrollbar.jquery.min.js',
            'src/assets/vendors/clipboard.js/clipboard.min.js',
            'src/assets/vendors/lity/lity.min.js',
            'src/assets/vendors/fitvids/jquery.fitvids.js',
            'src/assets/vendors/matchHeight.min.js'
          ],

          // CSS
          'src/assets/css/theDocs.all.min.css': [
            'src/assets/vendors/bootstrap/css/bootstrap.min.css',
            'src/assets/vendors/font-awesome/css/font-awesome.min.css',
            'src/assets/vendors/prism/prism.css',
            'src/assets/vendors/perfect-scrollbar/css/perfect-scrollbar.min.css',
            'src/assets/vendors/lity/lity.min.css'
          ]
        },
      },
    },

    // Uglify JS files
    uglify: {
      options: {
        mangle: true,
        //preserveComments: 'some',
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          //'dist/Documentation/assets/js/<%= pkg.name %>.js': ['dist/Documentation/assets/js/<%= pkg.name %>.js'],
          //'dist/Starter-kit/assets/js/<%= pkg.name %>.js': ['dist/Starter-kit/assets/js/<%= pkg.name %>.js']
        }
      },
      dev: {
        files: {
          'src/assets/js/theDocs.min.js': ['src/assets/js/theDocs.js']
        }
      }
    },

    // Do some post processing on CSS files
    postcss: {
      options: {
        processors: [
          autoprefixer, // add vendor prefixes
          //require('cssnano')({zindex: false}) // minify the result
        ]
      },
      dist: {
        //src: 'dist/*/assets/css/*.css'
      },
      dev: {
        src: ['src/assets/css/theDocs.css', 'src/assets/css/theDocs.min.css']
      }
    },
    
    // Create custom.js and custom.css files
    "file-creator": {
      build: {
        "dist/Starter-kit/assets/js/custom.js": function(fs, fd, done) {
          fs.writeSync(fd, '$(function() {\n\n\n\n})(jQuery);');
          done();
        },
        
        "dist/Starter-kit/assets/css/custom.css": function(fs, fd, done) {
          fs.writeSync(fd, '');
          done();
        }
      }
    },
    
  
    // -------------------------------------------------------------------------------
    // END Task configuration
    
  });


  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-file-creator');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', ['browserSync', 'watch']);

  grunt.registerTask('dist',
    [
      'dev',
      'sass:dist',
      'clean:before_copy',
      'copy:dist',
      'concat:dist',
      'replace:dist',
      'uglify:dist',
      'postcss:dist',
      'clean:after_copy',
      'file-creator',
      'copy:source'
    ]
  );

  grunt.registerTask('dev',
    [
      'sass',
      'concat:dev',
      'uglify:dev',
      'postcss:dev',
      'copy:dev',
      //'watch'
    ]
  );

};