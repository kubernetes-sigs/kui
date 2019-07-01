git checkout -b release-branch

# bump version and generate changelogs without committing and pushing to git
npx lerna version --conventional-commits --yes --no-push --no-git-tag-version

# git commit and push to make pr
git commit -a -m "chore(release): publish official release"
git push --set-upstream origin release-branch

hub pull-request -b IBM/kui:master



