import { Command } from 'commander'
import { generateChangelogForTag } from '../lib/functions.mjs'

const program = new Command()
program
  .argument('<tag>', 'The tag to display the changes for')
  .argument('[title]', 'Path to the CHANGELOG.md file', 'CHANGELOG')
  .argument('[url]', 'URL used for linking to compare links and tags.', '')
  .argument(
    '[footer]',
    'Additional text to be displayed at the bottom of the changelog.',
    ''
  )
program.exitOverride((err) => {
  if (err.code === 'commander.missingArgument') {
    console.log()
    program.outputHelp()
  }
  process.exit(err.exitCode)
})
program.parse(process.argv)
const changelog = generateChangelogForTag(
  program.processedArgs[0],
  program.processedArgs[1],
  program.processedArgs[2],
  program.processedArgs[3],
)
console.log(changelog.toString())
