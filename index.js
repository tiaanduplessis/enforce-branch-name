const { execFileSync } = require('child_process')

function getBranchName () {
  try {
    const output = execFileSync('git', ['branch', '--no-color'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 10 * 1000 * 1000
    })
    const currentBranch = output.split(/\r?\n/).find(line => line.startsWith('* '))
    return currentBranch ? currentBranch.slice(2) : false
  } catch (error) {
    return false
  }
}

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
