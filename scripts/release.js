const fs = require('fs')
const execa = require('execa')
const chalk = require('chalk')

const path = 'package.json'
const args = process.argv.slice(2)
const pkg = JSON.parse(fs.readFileSync(path, 'utf-8'))

const releaseVersion = args[0]

pkg.version = releaseVersion

fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n')

execa.sync('npm run changelog')
console.log(chalk.blue(`update v${releaseVersion}`));

execa.sync('git add .')
execa.sync('git', ['commit', '-m', `update v${releaseVersion}`])
console.log(chalk.blue('git commit'));
