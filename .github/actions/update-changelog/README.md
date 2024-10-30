# Update Changelog

This action will update the named changelog with the provided input.

It requires the following input:
- Changelog filename to update.
- Release version.
- Release date.
- Release title.
- Release notes.

It is not responsible for:
- Fetching the changelog.
- Committing the result.
- Creating PRs.
- Generating the content to update the change log with.
- Determining the new version.
- Detecting duplicate versions in the changelog.

All it does the following:
- Find where releases start in the changelog.
- Add the new changelog contents to the changelog.

## Development

The action's logic is contained in `index.js`. Tests are contained in `__tests__` and use Jest.

To run tests use `npm test`.
