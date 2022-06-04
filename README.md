# commitchangelog

> Manage your changelogs in your commits and generate a shorter, friendlier CHANGELOG

Having a CHANGELOG.md file ist all fine, but often merge conflicts arise, when including Unreleased changes.
This CLI-Tool should solve that, and provide ways to add formatted, human readable changes for example in merge requests or release notes.

## Usage
### Collecting changes

- The format is based on [Keep a Changelog](http://keepachangelog.com/).
- The changes are embedded in your commit bodies using the keywords from  [Keep a Changelog](http://keepachangelog.com/).
- Not all commits have to have a `[changelog]` block. If there is no relevant change in the commit, is may be left out.

**Example**:
```text
refactor: es6

[changelog]
changed: refactored to es6
removed: gitlog dependency
```

### CLI
```shell
Usage: ccl [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  full            display a full Markdown with all releases (inkl. Unreleased)
  write           write the full Markdown with all releases (inkl. Unreleased) into a file
  unreleased      Display markdown from the unreleased changelog entries
  tag             Display markdown a specific tag
  compare         Display markdown of the changes between git revisions
  compare-head    Display markdown of the changes between HEAD and a chosen git revision/branch/tag
  help [command]  display help for command
```

### npx
```shell
# Displays help message as seen above
npx gitccl
```

## Requirements

- `git`

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install --save-dev commitchangelog
```

## Acknowledgments


commitchangelog was heavily inspired by [git-cl](https://github.com/uptech/git-cl).

## Changelog

The changelog of this CLI Tool may serve as an example:

See [CHANGELOG.md](https://github.com/ltakacs95/commitchangelog/blob/main/CHANGELOG.md).

## License

MIT
