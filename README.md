
# enforce-branch-name
[![package version](https://img.shields.io/npm/v/enforce-branch-name.svg?style=flat-square)](https://npmjs.org/package/enforce-branch-name)
[![package downloads](https://img.shields.io/npm/dm/enforce-branch-name.svg?style=flat-square)](https://npmjs.org/package/enforce-branch-name)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/enforce-branch-name.svg?style=flat-square)](https://npmjs.org/package/enforce-branch-name)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> Little utility to be used in conjunction with Husky to enforce a branch naming convention

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#License)

## Install

This project uses [node](https://nodejs.org) and [npm](https://www.npmjs.com). 


First make sure [`husky`](https://github.com/typicode/husky) is installed. Then install `enforce-branch-name`:

```sh
$ npm install --save-dev enforce-branch-name
$ # OR
$ yarn add --dev enforce-branch-name
```

## Usage

Now setup your hook:

```
// package.json
{
  "husky": {
    "hooks": {
      "pre-push": "enforce-branch-name (hotfix|bugfix|feature)\/.+ --ignore staging",
    }
  }
}
```

## Contribute

1. Fork it and create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am "Add some feature"`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request

## License

MIT
    