const fs = require('fs')
const execa = require('execa')
const chalk = require('chalk')

const args = process.argv.slice(2)
const releaseVersion = args[0]

const tip = msg => console.log(chalk.cyan(msg + '\n'))

function updatePackage(version) {
    tip(`update v${version}...`);
    const pkgPath = 'package.json'
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    pkg.version = version
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function updateChangelog() {
    tip('update changelog...');
    const { stdout } = execa.sync('npm run changelog')
    console.log(stdout);
}

function gitPush(version) {
    tip('git commit...')
    execa.sync('git add .')
    execa.sync('git', ['commit', '-m', `update v${version}`])
    execa.sync('git', ['tag', `v${version}`])
    execa.sync('git', ['push', 'origin', `v${version}`])
    execa.sync('git push')
    tip('git push')
}


updatePackage(releaseVersion)
updateChangelog()
gitPush(releaseVersion)

