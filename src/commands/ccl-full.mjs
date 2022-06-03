import {Command} from "commander";
import {generateFullChangelog} from "../lib/functions.mjs";

const program = new Command()
program.argument('<title>', 'The title on top of the CHANGELOG')

program.exitOverride((err) => {
  if (err.code === 'commander.missingArgument') {
    console.log()
    program.outputHelp();
  }
  process.exit(err.exitCode);
});
program.parse(process.argv)
const changelog = generateFullChangelog(program.processedArgs[0])
console.log(changelog.toString())
