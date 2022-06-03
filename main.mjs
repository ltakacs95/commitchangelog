import {program} from "commander";
import { readFile } from 'fs/promises';

const version = JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
program
  .name('ccl')
  .version(version)
  .executableDir('./src/commands')
  .command('full', 'get a full Markdown with all releases ( inkl. Unreleased )', { isDefault: true })
// .command('list', 'list packages installed', { isDefault: true })

program.parse(process.argv)
