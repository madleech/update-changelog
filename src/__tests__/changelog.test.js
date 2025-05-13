const fs = require("node:fs");
const Changelog = require("../changelog");

// Mock fs module
jest.mock("node:fs");

describe("Changelog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insert", () => {
    it("inserts a new version entry at the top of the changelog", () => {
      const changelogContent = `# Changelog

## [1.0.0] - 2023-01-01

### Added
- Initial release
`;
      fs.readFileSync.mockReturnValue(changelogContent);

      const changelog = new Changelog("CHANGELOG.md");
      changelog.insert({
        version: "1.1.0",
        date: "2023-02-01",
        title: "New Features",
        body: "### Added\n- Feature 1\n- Feature 2",
      });

      const expectedContent = `# Changelog

## [1.1.0] - 2023-02-01 - New Features

### Added
- Feature 1
- Feature 2

## [1.0.0] - 2023-01-01

### Added
- Initial release
`;
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "CHANGELOG.md",
        expectedContent,
      );
    });

    it("handles empty changelog file", () => {
      fs.readFileSync.mockReturnValue("");

      const changelog = new Changelog("CHANGELOG.md");
      changelog.insert({
        version: "1.0.0",
        date: "2023-01-01",
        title: "Initial Release",
        body: "### Added\n- First feature",
      });

      const expectedContent = `## [1.0.0] - 2023-01-01 - Initial Release

### Added
- First feature

`;
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "CHANGELOG.md",
        expectedContent,
      );
    });

    it("preserves existing content when inserting new version", () => {
      const changelogContent = `# Changelog

## [1.0.0] - 2023-01-01 - Initial Release

### Added
- Initial release

## [0.9.0] - 2022-12-01 - Beta Features

### Added
- Beta features
`;
      fs.readFileSync.mockReturnValue(changelogContent);

      const changelog = new Changelog("CHANGELOG.md");
      changelog.insert({
        version: "1.1.0",
        date: "2023-02-01",
        title: "New Features",
        body: "### Added\n- Feature 1\n- Feature 2",
      });

      const expectedContent = `# Changelog

## [1.1.0] - 2023-02-01 - New Features

### Added
- Feature 1
- Feature 2

## [1.0.0] - 2023-01-01 - Initial Release

### Added
- Initial release

## [0.9.0] - 2022-12-01 - Beta Features

### Added
- Beta features
`;
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        "CHANGELOG.md",
        expectedContent,
      );
    });

    it("raises an error if version already exists", () => {
      const changelogContent = `# Changelog

## [1.0.0] - 2023-01-01 - Initial Release

...`;
      fs.readFileSync.mockReturnValue(changelogContent);
      const changelog = new Changelog("CHANGELOG.md");
      expect(() =>
        changelog.insert({
          version: "1.0.0",
          date: "2023-01-01",
          title: "Initial Release",
          body: "### Added\n- First feature",
        }),
      ).toThrow("Changelog already contains version 1.0.0");
    });
  });
});
