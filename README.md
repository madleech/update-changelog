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

All it does the following:

- Find where releases start in the changelog.
- Add the new changelog contents to the changelog.
- Detect duplicate versions in the changelog.

## Workflow

A basic workflow can execute:

```yaml
on:
  release:
    types: [published, edited]

name: Update release notes

jobs:
  update-release-notes:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Add release to server release notes
        uses: madleech/update-changelog
        with:
          filename: CHANGELOG.md
          version: ${{ github.event.release.tag_name }}
          date: ${{ github.event.release.published_at }}
          title: ${{ github.event.release.name }}
          body: ${{ github.event.release.body }}
      - name: Commit result
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add CHANGELOG.md
          git commit -m "Add ${{ github.event.release.tag_name }}"
          git push
```

A more complex example might keep the changelogs elsewhere, for example in a public repository. In this case, you will need to handle cloning the repository that contains the changelogs, and commit the results back. You will also need to ensure you use a personal access token that has permission to access the repository, as the automatic workflow token only has rights to the repository it is running on.

To do this, ammend the checkout step to be:

```yaml
- name: Checkout release notes
  uses: actions/checkout@v4
  with:
    repository: ...
    token: ${{ secrets.GH_PAT }}
```

The remaining steps should remain the same.

## Development

The action's logic is contained in `index.js`. Tests are contained in `__tests__` and use Jest.

To run tests use `npm run test`.
