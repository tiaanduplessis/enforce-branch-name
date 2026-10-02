const assert = require('assert')
const { spawnSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const cli = path.resolve(__dirname, '../cli.js')
const pattern = '^feature/[a-z_]+$'
const ansi = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m')
let passed = 0

function fixture (runTest) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'enforce-branch-name-'))

  try {
    const repo = path.join(root, 'repo')
    const outside = path.join(root, 'outside')
    const templates = path.join(root, 'templates')
    const hooks = path.join(root, 'hooks')
    const home = path.join(root, 'home')
    for (const directory of [repo, outside, templates, hooks, home]) {
      fs.mkdirSync(directory)
    }

    const env = Object.fromEntries(
      Object.entries(process.env).filter(([key]) => !/^GIT_/i.test(key))
    )
    Object.assign(env, {
      HOME: home,
      XDG_CONFIG_HOME: home,
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_CONFIG_SYSTEM: os.devNull,
      GIT_CONFIG_GLOBAL: os.devNull,
      GIT_CEILING_DIRECTORIES: root,
      GIT_TEMPLATE_DIR: templates,
      GIT_TERMINAL_PROMPT: '0',
      GIT_PAGER: 'cat'
    })

    function run (command, args, cwd = repo) {
      const result = spawnSync(command, args, { cwd, env, encoding: 'utf8' })
      if (result.error) throw result.error
      assert.strictEqual(result.signal, null, `${command} terminated: ${result.signal}`)
      return result
    }

    function git (...args) {
      const result = run('git', args)
      assert.strictEqual(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`)
      return result.stdout
    }

    function invoke (args, cwd = repo) {
      return run(process.execPath, [cli, ...args], cwd)
    }

    git('init', '--quiet', '--template', templates)
    git('symbolic-ref', 'HEAD', 'refs/heads/feature/my_feature')
    git('config', 'user.name', 'Branch test')
    git('config', 'user.email', 'branch-test@example.invalid')
    git('config', 'core.hooksPath', hooks)
    git('config', 'commit.gpgsign', 'false')
    git('config', 'color.ui', 'never')
    git('config', 'color.branch.current', 'green')
    git('commit', '--quiet', '--allow-empty', '-m', 'Test fixture')

    runTest({ git, invoke, outside })
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
}

function test (name, runTest) {
  fixture(runTest)
  passed++
  console.log(`ok ${passed} - ${name}`)
}

function success (result, stderr = '') {
  assert.strictEqual(result.status, 0, result.stderr)
  assert.strictEqual(result.stdout, '')
  assert.strictEqual(result.stderr, stderr)
}

function failure (result, message) {
  assert.strictEqual(result.status, 1, result.stderr)
  assert.strictEqual(result.stdout, '')
  assert.strictEqual(result.stderr, `${message}\n`)
  assert.strictEqual(ansi.test(result.stderr), false, 'Diagnostics contain ANSI color')
}

function forceColor (git) {
  git('config', 'color.ui', 'always')
  const output = git('branch')
  assert(ansi.test(output), 'Fixture must produce ANSI-colored Git branch output')
  return output
}

test('accepts an anchored pattern on a normal branch', ({ git, invoke }) => {
  assert.strictEqual(ansi.test(git('branch')), false)
  success(invoke([pattern]))
})

test('accepts an anchored pattern when Git always uses color', ({ git, invoke }) => {
  const output = forceColor(git)
  assert.strictEqual(new RegExp(pattern).test(output.replace(/^\* /, '').trim()), false)
  success(invoke([pattern]))
})

for (const color of ['never', 'always']) {
  test(`rejects a nonmatching branch with color.ui=${color}`, ({ git, invoke }) => {
    git('checkout', '--quiet', '-b', 'bad-name')
    if (color === 'always') forceColor(git)
    failure(invoke([pattern]), 'Current branch name bad-name does not match the enforced naming convention.')
  })
}

test('accepts an exact ignore pattern on a colored branch', ({ git, invoke }) => {
  git('checkout', '--quiet', '-b', 'staging')
  forceColor(git)
  success(invoke([pattern, '--ignore', '^staging$']), 'Ignoring staging branch naming convention check.\n')
})

test('does not ignore a branch that only shares the ignored prefix', ({ git, invoke }) => {
  git('checkout', '--quiet', '-b', 'staging-extra')
  forceColor(git)
  failure(invoke([pattern, '--ignore', '^staging$']), 'Current branch name staging-extra does not match the enforced naming convention.')
})

test('reports a missing regex pattern', ({ invoke }) => {
  failure(invoke([]), 'No regex pattern provided')
})

test('reports a directory outside a Git repository', ({ invoke, outside }) => {
  failure(invoke([pattern], outside), 'Directory is not a git repository.')
})

console.log(`${passed} tests passed`)
