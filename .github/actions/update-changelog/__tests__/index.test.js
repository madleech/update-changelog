/**
 * Unit tests for the action's entrypoint, src/index.js
 */

const core = require('@actions/core')
const fs = require('node:fs')

// mock github actions "core" package
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()

// mock "fs" package
const fsWriteMock = jest.spyOn(fs, 'writeFileSync').mockImplementation()

describe('index', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('adds changelog', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'filename':
          return '__tests__/dummy_changelog.md'
        case 'version':
          return 'v1.2.3'
        case 'date':
          return '2021-03-04T00:11:22Z'
        case 'title':
          return 'Test release'
        case 'body':
          return "### Added\n* Some more new features\n\n### Changed\n* Some more bug fixes"
        default:
          return ''
      }
    })

    require('../index')

    const expectedOutput = fs.readFileSync('__tests__/dummy_changelog_output.md', 'utf-8');
    expect(fsWriteMock).toHaveBeenCalledWith('__tests__/dummy_changelog.md', expectedOutput);
  })
})
