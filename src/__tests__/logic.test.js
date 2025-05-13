/**
 * Unit tests for the action's entrypoint, src/index.js
 */

const core = require("@actions/core");

// Mock Changelog before requiring logic
const mockChangelogInstance = { insert: jest.fn() };
const mockChangelog = jest.fn().mockImplementation(() => mockChangelogInstance);

jest.mock("../changelog", () => mockChangelog);

const logic = require("../logic");

// mock github actions "core" package
const getInputMock = jest.spyOn(core, "getInput").mockImplementation();
const setFailedMock = jest.spyOn(core, "setFailed").mockImplementation();

describe("index", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getInputMock.mockImplementation((name) => {
      switch (name) {
        case "filename":
          return "changelog.md";
        case "version":
          return "v1.2.3";
        case "date":
          return "2021-03-04T00:11:22Z";
        case "title":
          return "Test release";
        case "body":
          return "### Added\n* Some more new features\n\n### Changed\n* Some more bug fixes";
        default:
          return "";
      }
    });
  });

  it("calls Changelog.insert()", async () => {
    logic.run();

    expect(mockChangelog).toHaveBeenCalledWith("changelog.md");
    expect(mockChangelogInstance.insert).toHaveBeenCalledWith({
      version: "1.2.3",
      date: "2021-03-04",
      title: "Test release",
      body: "### Added\n* Some more new features\n\n### Changed\n* Some more bug fixes",
    });
  });

  it("catches and logs errors", async () => {
    mockChangelogInstance.insert.mockImplementation(() => {
      throw new Error("Test error");
    });

    logic.run();

    expect(setFailedMock).toHaveBeenCalledWith("Test error");
  });
});
