const exec = require('child_process').exec
const symbols = require('node-symbols')
const os = require('os')

const defaultOptions = {
  initialFile: '',
  endPath: './',
  zipName: '',
  frontShell: '',
  behindShell: '',
  shell: ''
}

export default class WebpackZipPlugin {
  constructor(options) {
    this.options = Object.assign(defaultOptions, options)
  }

  validate(options) {
    if(!options.initialFile || !options.zipName) {
      return false
    }
  }

  handleZip() {
    const behindShell =  this.options.behindShell ? (`&& ${this.options.behindShell}`) : ''
    console.log( ` ${symbols('tick', 'green')} WebpackZipPlugin[${new Date()}]: ${this.options.initialFile}/*-->${this.options.endPath}/${this.options.zipName}` )
    if(this.options.shell){
      this.spreadStdoutAndStdErr(exec(this.options.shell, this.pipe));
    }else{
      this.options.frontShell && this.spreadStdoutAndStdErr(exec(`${this.options.frontShell}`, this.pipe))
      this.spreadStdoutAndStdErr(exec(`mkdir -p ${this.options.endPath} && zip -r ${this.options.endPath}/${this.options.zipName} ${this.options.initialFile} ${behindShell}`, this.pipe))
    }
  }

  pipe(error, stdout, stderr) {
    if (error) {
      throw error;
    }
  }

  spreadStdoutAndStdErr(stream) {
    stream.stdout.pipe(process.stdout)
    stream.stderr.pipe(process.stdout)
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation, callback) => {
    })
    compiler.plugin('emit', (compilation, callback) => {
      callback()
    })
    compiler.plugin('done', (compilation, callback) => {
      this.handleZip()
    })
  }
}
