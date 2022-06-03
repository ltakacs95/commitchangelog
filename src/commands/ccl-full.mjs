import { Command } from 'commander'
import { generateFullChangelog } from '../lib/functions.mjs'

const program = new Command()
program
  .argument('[title]', 'The title on top of the CHANGELOG.', 'CHANGELOG')
  .argument('[url]', 'URL used for linking to compare links and tags.', '')
  .argument('[footer]', 'Additional text to be displayed at the bottom of the changelog.', '')

program.exitOverride((err) => {
  if (err.code === 'commander.missingArgument') {
    console.log()
    program.outputHelp()
  }
  process.exit(err.exitCode)
})
program.parse(process.argv)
const changelog = generateFullChangelog(program.processedArgs[0], program.processedArgs[1], program.processedArgs[2])

console.log(changelog.toString())
