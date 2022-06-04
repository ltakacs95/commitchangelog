import { Command } from 'commander'
import { generateReleaseForTag } from '../lib/functions.mjs'

const program = new Command()
program
  .argument('<tag>', 'The tag to display the changes for')
program.exitOverride((err) => {
  if (err.code === 'commander.missingArgument') {
    console.log()
    program.outputHelp()
  }
  process.exit(err.exitCode)
})
program.parse(process.argv)
const release = generateReleaseForTag(
  program.processedArgs[0],
)
console.log(release.toString())
