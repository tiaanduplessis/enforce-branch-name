
# enforce-branch-name
[![package version](https://img.shields.io/npm/v/enforce-branch-name.svg?style=flat-square)](https://npmjs.org/package/enforce-branch-name)
[![package downloads](https://img.shields.io/npm/dm/enforce-branch-name.svg?style=flat-square)](https://npmjs.org/package/enforce-branch-name)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/enforce-branch-name.svg?style=flat-square)](https://npmjs.org/package/enforce-branch-name)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> Little utility to enforce a branch naming convention

## Table of Contents

- [enforce-branch-name](#enforce-branch-name)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
  - [Usage](#usage)
    - [With husky](#with-husky)
  - [Contributing](#contributing)
  - [License](#license)

## Install

With `npm`:
```sh
npm install --save-dev enforce-branch-name
```

With `yarn`:
```sh
yarn add -D enforce-branch-name
```

With `pnpm`:
```sh
pnpm add -D enforce-branch-name
```


## Usage

Enforce that a branch starts with the prefix `hotfix/`, `bugfix/` or `/feature`. Ignore this check if on the `staging` branch:

```sh
enforce-branch-name '(hotfix|bugfix|feature)\/.+' --ignore 'staging'
```

### With husky

First make sure [`husky`](https://github.com/typicode/husky) is installed and configured. Then configure your hook pre-push hook:

```
// package.json
{
  "husky": {
    "hooks": {
      "pre-push": "enforce-branch-name '(hotfix|bugfix|feature)\/.+' --ignore 'staging'",
    }
  }
}
```

## Contributing

Got an idea for a new feature? Found a bug? Contributions are welcome! Please [open up an issue](https://github.com/tiaanduplessis/enforce-branch-name/issues) or [make a pull request](https://makeapullrequest.com/).

## License

[MIT © Tiaan du Plessis](./LICENSE)


    