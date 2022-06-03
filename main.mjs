import { program } from 'commander'
import { readFile } from 'fs/promises'

const version = JSON.parse(await readFile(new URL('./package.json', import.meta.url))).version
program
  .name('ccl')
  .version(version)
  .executableDir('./src/commands')
  .command('full', 'display a full Markdown with all releases ( inkl. Unreleased )')
  .command('write', 'write the full Markdown with all releases ( inkl. Unreleased ) into a file')
  .command('unreleased', 'Display markdown from the unreleased changelog entries')

program.parse(process.argv)
