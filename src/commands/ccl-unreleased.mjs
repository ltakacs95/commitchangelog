import { Command } from 'commander'
import { createUnreleasedRelease } from '../lib/functions.mjs'

const program = new Command()

program.exitOverride((err) => {
  if (err.code === 'commander.missingArgument') {
    console.log()
    program.outputHelp()
  }
  process.exit(err.exitCode)
})
program.parse(process.argv)
const unreleased = createUnreleasedRelease()
console.log(unreleased.toString())
