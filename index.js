#!/usr/bin/env node

const branchName = require("current-git-branch")();
const args = require("get-them-args")();

if (!args.unknown[0]) {
  console.error("No regex pattern provided");
  process.exit(1);
}

if (args.ignore && new RegExp(args.ignore).test(branchName)) {
  console.warn(`Ignoring ${branchName} branch name check.`);
  return;
}

if (args.ignore && args.ignore.indexOf(",") > -1) {
  const argsValues = args.ignore.split(",");
  argsValues.map(function (branch) {
    console.warn(`Ignoring ${branch} branch name check.`);
    return;
  });
}

const pattern = new RegExp(args.unknown[0]);

if (!pattern.test(branchName)) {
  console.error(
    `Current branch name ${branchName} does not match the enforced naming.`,
  );
  process.exit(1);
}
