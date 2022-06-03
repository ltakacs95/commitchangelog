import shell from "shelljs";
import {Changelog, Release} from "keep-a-changelog";


const getFirstCommit = () => {
  let {stdout: firstCommit} = shell
    .exec('git rev-list --max-parents=0 HEAD', {
      silent: true
    })

  firstCommit = firstCommit.replace(/\r?\n|\r/, '')
  return firstCommit
}

const getTagDates = () => {
  const {stdout: tagsString} = shell
    .exec('git for-each-ref --sort=v:refname --format "%(creatordate:iso)" refs/tags', {
      silent: true
    })
  return tagsString.split('\n').filter((tag) => tag.length)
}

const getTags = () => {
  const {stdout: tagsString} = shell
    .exec('git for-each-ref --sort=v:refname --format "%(refname:strip=2)" refs/tags', {
      silent: true
    })
  return tagsString.split('\n').filter((tag) => tag.length)
}

const getCommits = branch => {
  const {stdout: commits} = shell
    .exec(`git --no-pager log --pretty='@commitchange@%n%B%-C()%n' ${branch}`, {
      silent: true
    })

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

const addTagToChangelog = (changelog, tag) => {
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

  // console.log({branch, targetTagIndex})
  const commits = getCommits(branch)

  // console.log({tag,commits})

  const release = new Release(tag.replace(/^v/, ''), getTagDates()[targetTagIndex])
  appendReleaseFromCommits(release, commits)

  changelog.addRelease(
    release
  )
}

const addUnreleasedToChangelog = (changelog) => {
  const tags = getTags().reverse()
  const firstCommit = getFirstCommit()
  const unreleased = new Release()
  const latestTag = tags[0] || firstCommit
  const branch = `${latestTag}..HEAD`
  const commits = getCommits(branch)

  appendReleaseFromCommits(unreleased, commits);
  changelog.addRelease(
    unreleased
  )
};

const generateFullChangelog = (title) => {
  const changelog = new Changelog(title)
  changelog.url = 'https://code.anexia.com/am/netcup/netcup.de'
  changelog.footer = 'Please refer to the Git history for older changes.'

  const firstCommit = getFirstCommit()
  const tags = getTags().reverse()

  tags.forEach((tag) => {
    addTagToChangelog(changelog, tag)
  })

  addUnreleasedToChangelog(changelog);
  return changelog
}
export {
  generateFullChangelog,
  getFirstCommit,
  addTagToChangelog,
  appendReleaseFromCommits,
  getTagDates,
  getTags
};
