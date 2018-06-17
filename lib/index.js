'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var exec = require('child_process').exec;
var symbols = require('node-symbols');
var os = require('os');

var defaultOptions = {
  initialFile: '',
  endPath: './',
  zipName: '',
  frontShell: '',
  behindShell: '',
  shell: ''
};

var WebpackZipPlugin = function () {
  function WebpackZipPlugin(options) {
    classCallCheck(this, WebpackZipPlugin);

    this.options = Object.assign(defaultOptions, options);
  }

  createClass(WebpackZipPlugin, [{
    key: 'validate',
    value: function validate(options) {
      if (!options.initialFile || !options.zipName) {
        return false;
      }
    }
  }, {
    key: 'handleZip',
    value: function handleZip() {
      var behindShell = this.options.behindShell ? '&& ' + this.options.behindShell : '';
      console.log(' ' + symbols('tick', 'green') + ' WebpackZipPlugin[' + new Date() + ']: ' + this.options.initialFile + '/*-->' + this.options.endPath + '/' + this.options.zipName);
      if (this.options.shell){
        this.spreadStdoutAndStdErr(exec(this.options.shell, this.pipe));
      }else{
        this.options.frontShell && this.spreadStdoutAndStdErr(exec('' + this.options.frontShell, this.pipe));
        this.spreadStdoutAndStdErr(exec('mkdir -p ' + this.options.endPath + ' && zip -r ' + this.options.endPath + '/' + this.options.zipName + ' ' + this.options.initialFile + ' ' + behindShell, this.pipe));
      }
    }
  }, {
    key: 'pipe',
    value: function pipe(error, stdout, stderr) {
      if (error) {
        throw error;
      }
    }
  }, {
    key: 'spreadStdoutAndStdErr',
    value: function spreadStdoutAndStdErr(stream) {
      stream.stdout.pipe(process.stdout);
      stream.stderr.pipe(process.stdout);
    }
  }, {
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('compilation', function (compilation, callback) {});
      compiler.plugin('emit', function (compilation, callback) {
        callback();
      });
      compiler.plugin('done', function (compilation, callback) {
        _this.handleZip();
      });
    }
  }]);
  return WebpackZipPlugin;
}();

module.exports = WebpackZipPlugin;
