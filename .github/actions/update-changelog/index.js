const core = require('@actions/core');
const fs = require('node:fs');

try {
  const filename = core.getInput('filename');
  const version = core.getInput('version').replace("v", "");
  const date = core.getInput('date').split("T", 1)[0];
  const title = core.getInput('title');
  const body = core.getInput('body');

  const release_notes = `## [${version}] - ${date} - ${title}\n\n${body}`;

  const changelog = fs.readFileSync(filename, 'utf8');
  const marker = /^## /m // m = multiple lines
  const match = marker.exec(changelog);
  const changelog_pre = changelog.substring(0, match.index);
  const changelog_post = changelog.substring(match.index);

  const updated_changelog = `${changelog_pre}${release_notes}\n\n${changelog_post}`;

  fs.writeFileSync(filename, updated_changelog);
} catch (error) {
  core.setFailed(error.message);
}
