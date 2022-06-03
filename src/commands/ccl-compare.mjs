import { Command } from 'commander'
import {
  createChangelog,
  createTemporaryChangeList
} from '../lib/functions.mjs'

const program = new Command()
program
  .argument('<branch>', 'The branch/tag/revision to compare')
  .argument('<comparedBranch>', 'The other branch/tag/revision to compare to')
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

const branch = `${program.processedArgs[0]}..${program.processedArgs[1]}`
const changelog = createChangelog(
  program.processedArgs[2],
  program.processedArgs[3],
  program.processedArgs[4]
)
const changeList = createTemporaryChangeList(branch)

changelog.addRelease(changeList)
console.log(changelog.toString().replace('## Unreleased', '## Changes'))
