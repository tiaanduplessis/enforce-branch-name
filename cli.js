#!/usr/bin/env node
const enforceBranchName = require('./')
const args = require('get-them-args')()

enforceBranchName(args)
