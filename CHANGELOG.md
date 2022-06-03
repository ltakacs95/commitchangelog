# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.4.0] - 2022-06-03
### Added
- `compare` command
- `compare-head` command
- `tag` command

### Changed
- Changelog title is optional
- `unreleased` command returns null if there are no changes to display
- In the full changelog output the *Unreleased* block is hidden, if there are no changes to display

## [0.3.0] - 2022-06-03
### Added
- Changelogs
- `write` command
- `unreleased` command

### Changed
- Additional options like URL and Footer Text may be provided
- Made unreleased functionality reusable

## [0.2.0] - 2022-06-03
### Added
- Added: full changelog generator command and helper functions

### Changed
- refactored to es6

### Removed
- gitlog dependency

## [0.1.0] - 2022-06-03
### Added
- initial development environment

[0.4.0]: https://github.com/ltakacs95/commitchangelog/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/ltakacs95/commitchangelog/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/ltakacs95/commitchangelog/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ltakacs95/commitchangelog/releases/tag/v0.1.0
