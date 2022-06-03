const {program} = require('commander')

const version = require('./package.json').version
program
  .name('ccl')
  .version(version)
  .executableDir("./src/commands")

program.parse(process.argv)
