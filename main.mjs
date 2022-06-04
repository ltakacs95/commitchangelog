#!/usr/bin/env node

import { program } from 'commander'
import { readFile } from 'fs/promises'

const version = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url))
).version
program
  .name('gitccl')
  .version(version)
  .executableDir('./src/commands')
  .command(
    'full',
    'display a full Markdown with all releases (inkl. Unreleased)'
  )
  .command(
    'write',
    'write the full Markdown with all releases (inkl. Unreleased) into a file'
  )
  .command(
    'unreleased',
    'Display markdown from the unreleased changelog entries'
  )
  .command('tag', 'List changes as markdown for a specific tag')
  .command('compare', 'Display markdown of the changes between git revisions')
  .command(
    'compare-head',
    'Display markdown of the changes between HEAD and a chosen git revision/branch/tag'
  )

program.parse(process.argv)
