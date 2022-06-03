import { Command } from 'commander'
import { generateFullChangelog } from '../lib/functions.mjs'
import fs from 'fs'

const program = new Command()
program
  .argument('[title]', 'The title on top of the CHANGELOG', 'CHANGELOG')
  .argument(
    '[file]',
    'Path to the CHANGELOG.md file',
    process.cwd() + '/CHANGELOG.md'
  )
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
const changelog = generateFullChangelog(
  program.processedArgs[0],
  program.processedArgs[2],
  program.processedArgs[3]
)
const file = program.processedArgs[1]
if (fs.existsSync(file)) {
  fs.unlinkSync(file)
}
fs.writeFileSync(file, changelog.toString())
console.log(`Changelog has been written to ${file}`)
