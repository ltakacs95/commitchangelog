import { Changelog, Release } from 'keep-a-changelog'
import shell from 'shelljs'

const getFirstCommit = () => {
  let { stdout: firstCommit } = shell.exec(
    'git rev-list --max-parents=0 HEAD',
    {
      silent: true
    }
  )

  firstCommit = firstCommit.replace(/\r?\n|\r/, '')
  return firstCommit
}

const getTagDates = () => {
  const { stdout: tagsString } = shell.exec(
    'git for-each-ref --sort=v:refname --format "%(creatordate:iso)" refs/tags',
    {
      silent: true
    }
  )
  return tagsString.split('\n').filter((tag) => tag.length)
}

const getTags = () => {
  const { stdout: tagsString } = shell.exec(
    'git for-each-ref --sort=v:refname --format "%(refname:strip=2)" refs/tags',
    {
      silent: true
    }
  )
  return tagsString.split('\n').filter((tag) => tag.length)
}

const getCommits = (branch) => {
  const { stdout: commits } = shell.exec(
    `git --no-pager log --pretty='@commitchange@%n%B%-C()%n' ${branch}`,
    {
      silent: true
    }
  )

  return commits.split('@commitchange@')
}

const appendReleaseFromCommits = (release, commits) => {
  commits
    .filter((body) => body.includes('[changelog]'))
    .forEach((body) => {
      body
        .replace(/^[\s\S]*?<p>|/, '')
        .split('\n')
        .filter((entry) => entry !== '[changelog]' && entry.length)
        .forEach((entry) => {
          const type = entry.split(':')[0].toLowerCase()
          const change = entry.replace(`${type}:`, '').trim()

          if (type === 'added') {
            release.added(change)
          } else if (type === 'changed') {
            release.changed(change)
          } else if (type === 'deprecated') {
            release.deprecated(change)
          } else if (type === 'removed') {
            release.removed(change)
          } else if (type === 'fixed') {
            release.fixed(change)
          } else if (type === 'security') {
            release.security(change)
          }
        })
    })
  return release
}

const createTemporaryChangeList = (branch) => {
  const release = new Release()
  const commits = getCommits(branch)

  appendReleaseFromCommits(release, commits)
  return release
}

const createUnreleasedRelease = () => {
  const tags = getTags().reverse()
  const firstCommit = getFirstCommit()
  const unreleased = new Release()
  const latestTag = tags[0] || firstCommit
  const branch = `${latestTag}..HEAD`
  const commits = getCommits(branch)

  appendReleaseFromCommits(unreleased, commits)
  return unreleased
}

const getReleaseChangesCount = (unreleased) =>
  Array.from(unreleased.changes.values()).flat().length

const addUnreleasedToChangelog = (changelog) => {
  const unreleased = createUnreleasedRelease()
  const numberOfChanges = getReleaseChangesCount(unreleased)
  if (!numberOfChanges) {
    return
  }

  changelog.addRelease(unreleased)
}

const createChangelog = (title, url = '', footer = '') => {
  const changelog = new Changelog(title)

  if (url) {
    changelog.url = url
  }
  if (footer) {
    changelog.footer = footer
  }
  return changelog
}

const generateReleaseForTag = (tag) => {
  const tags = getTags().reverse()

  if (!tags.includes(tag)) {
    console.log(`${tag} doest exists. Try one of these: ${tags.join(', ')}`)
    process.exit(1)
  }

  const targetTagIndex = tags.indexOf(tag)

  let branch
  let fromTag
  if (targetTagIndex >= 0 && targetTagIndex < tags.length - 1) {
    fromTag = tags[targetTagIndex + 1]
    branch = `${fromTag}..${tag}`
  }
  if (targetTagIndex === tags.length - 1) {
    fromTag = getFirstCommit()
    branch = `${fromTag}..${tag}`
  }

  const commits = getCommits(branch)
  const release = new Release(
    tag.replace(/^v/, ''),
    getTagDates().reverse()[targetTagIndex]
  )
  appendReleaseFromCommits(release, commits)

  return release
}
const generateFullChangelog = (title, url = '', footer = '') => {
  const changelog = createChangelog(title, url, footer)

  const tags = getTags().reverse()

  tags.forEach((tag) => {
    const tags = getTags().reverse()
    const targetTagIndex = tags.indexOf(tag)

    let branch
    let fromTag
    if (targetTagIndex >= 0 && targetTagIndex < tags.length - 1) {
      fromTag = tags[targetTagIndex + 1]
      branch = `${fromTag}..${tag}`
    }
    if (targetTagIndex === tags.length - 1) {
      fromTag = getFirstCommit()
      branch = `${fromTag}..${tag}`
    }

    const commits = getCommits(branch)
    const release = new Release(
      tag.replace(/^v/, ''),
      getTagDates().reverse()[targetTagIndex]
    )
    appendReleaseFromCommits(release, commits)

    changelog.addRelease(release)
  })

  addUnreleasedToChangelog(changelog)
  return changelog
}
export {
  generateFullChangelog,
  createUnreleasedRelease,
  addUnreleasedToChangelog,
  getFirstCommit,
  appendReleaseFromCommits,
  getTagDates,
  getTags,
  getReleaseChangesCount,
  generateReleaseForTag,
  createTemporaryChangeList,
  createChangelog
}
