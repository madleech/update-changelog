const core = require("@actions/core");
const Changelog = require("./changelog.js");

function run() {
  try {
    const filename = core.getInput("filename");
    const version = core.getInput("version").replace("v", "");
    const date = core.getInput("date").split("T", 1)[0];
    const title = core.getInput("title");
    const body = core.getInput("body");

    const changelog = new Changelog(filename);
    changelog.insert({ version, date, title, body });
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = { run };
