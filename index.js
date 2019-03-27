#!/usr/bin/env node

const branchName = require('current-git-branch')()
const args = require('get-them-args')()

if (!args.unknown[0]) {
  console.error('No regex pattern provided')
  process.exit(1)
}

if (args.ignore && new RegExp(args.ignore).test(branchName)) {
  console.warn(`Ignoring ${branchName} branch name check.`)
}

const pattern = new RegExp(args.unknown[0])

if (!pattern.test(branchName)) {
  console.error(
    `Current branch name ${branchName} does not match the enforced naming.`
  )
  process.exit(1)
}
