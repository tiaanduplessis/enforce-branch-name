const getBranchName = require('current-git-branch')

module.exports = (args) => {
  const branchName = getBranchName()

  if (!branchName) {
    console.error('Directory is not a git repository.')
    process.exit(1)
  }

  if (!args.unknown[0]) {
    console.error('No regex pattern provided')
    process.exit(1)
  }

  if (args.ignore && new RegExp(args.ignore).test(branchName)) {
    console.warn(`Ignoring ${branchName} branch naming convention check.`)
    return
  }

  const pattern = new RegExp(args.unknown[0])

  if (!pattern.test(branchName)) {
    console.error(
      `Current branch name ${branchName} does not match the enforced naming convention.`
    )
    process.exit(1)
  }
}
