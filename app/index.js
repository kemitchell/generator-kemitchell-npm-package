var camelcase = require('camelcase');
var npmName = require('npm-name');
var path = require('path');
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  init: function() {
    this.pkg = require('../package.json');
  },

  askForModuleName: function() {
    var done = this.async();

    var prompts = [{
      name: 'name',
      message: 'Module Name',
      default: path.basename(process.cwd()),
    }, {
      type: 'confirm',
      name: 'pkgName',
      message: 'The name above already exists on npm, choose another?',
      default: true,
      when: function(answers) {
        var done = this.async();

        npmName(answers.name, function(err, available) {
          if (!available) {
            done(true);
            return;
          }

          done(false);
        });
      }
    }];

    this.prompt(prompts, function(props) {
      if (props.pkgName) {
        return this.askForModuleName();
      }
      this.name = props.name;
      this.camelCaseName = camelcase(this.name);
      done();
    }.bind(this));
  },

  askFor: function() {
    var cb = this.async();

    var prompts = [
      {
        name: 'description',
        message: 'Description',
        default: 'The best module ever'
      }, {
        name: 'githubUsername',
        message: 'GitHub username or organization',
        default: 'kemitchell',
        store: true
      }, {
        name: 'keywords',
        message: 'keywords (comma to split)'
      }, {
        type: 'confirm',
        name: 'cli',
        message: 'Command-line interface'
      }, {
        type: 'confirm',
        name: 'travis',
        message: 'Use Travis CI'
      }
    ];

    this.prompt(prompts, function(props) {
      this.repository = props.githubUsername + '/' + this.name + '.js';

      this.keywords = props.keywords
        .split(',')
        .map(function(element) {
          return element.trim();
        })
        .filter(function(element) {
          return element.length > 0;
        });

      this.props = props;

      cb();
    }.bind(this));
  },

  app: function() {
    this.config.save();

    [
      'editorconfig',
      'gitattributes',
      'gitignore',
      'jscsrc',
      'jshintrc',
      'npmignore'
    ]
      .forEach(function(dotfile) {
        this.copy(dotfile, '.' + dotfile);
      }.bind(this));

    if (this.props.travis) {
      this.copy('travis.yml', '.travis.yml');
    }

    this.copy('_README.md', 'README.md');
    this.copy('LICENSE', 'LICENSE');

    this.mkdir('source');

    if (this.props.cli) {
      this.template('source/cli.js', 'source/cli.js');
      this.template('source/usage.txt', 'source/usage.txt');
      this.mkdir('bin');
      this.template('bin/cli', 'bin/' + this.name);
    }
  },

  projectfiles: function() {
    this.template('source/index.js', 'source/index.js');
    this.mkdir('test');
    this.template('test/module.test.js', 'test/module.test.js');
  },

  installDev: function() {
    this.npmInstall(
      [
        'covert',
        'fixpack',
        'jscs',
        'jsmd',
        'jshint',
        'tap'
      ],
      {saveDev: true}
    );
  },

  install: function() {
    if (this.props.cli) {
      this.npmInstall(['docopt'], {save: true});
    }
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install'],
      callback: function() {
        this.spawnCommand('./node_modules/.bin/fixpack');
      }.bind(this)
    });
  }
});
