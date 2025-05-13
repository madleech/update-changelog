const fs = require("node:fs");

class Changelog {
  #content;
  constructor(filename) {
    this.filename = filename;
  }

  get content() {
    this.#content = fs.readFileSync(this.filename, "utf8");
    return this.#content;
  }

  set content(content) {
    this.#content = content;
    fs.writeFileSync(this.filename, content);
  }

  insert({ version, date, title, body }) {
    if (this.alreadyContainsVersion(version)) {
      throw new Error(`Changelog already contains version ${version}`);
    }

    const newContent = this.format({ version, date, title, body });

    let index;
    if (this.isEmpty()) {
      index = this.content.length;
    } else {
      const marker = /^## /m; // m = multiple lines
      const match = marker.exec(this.content);
      index = match ? match.index : this.content.length;
    }

    const header = this.content.substring(0, index);
    const footer = this.content.substring(index);

    this.content = `${header}${newContent}\n\n${footer}`;
  }

  isEmpty() {
    return this.content.replace(/[\n\s]+/).length === 0;
  }

  format({ version, date, title, body }) {
    return `## [${version}] - ${date} - ${title}\n\n${body}`;
  }

  alreadyContainsVersion(version) {
    return this.content.indexOf(`## [${version}] `) > -1;
  }

  write() {
    fs.writeFileSync(this.filename, this.content);
  }
}

module.exports = Changelog;
