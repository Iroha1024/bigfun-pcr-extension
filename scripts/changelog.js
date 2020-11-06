const fs = require('fs')

const path = 'CHANGELOG.md'

let changelog = fs.readFileSync(path, { encoding: 'utf-8' })

const map = [['🐛', 'Bug Fixes'], ['✨', 'Features']]

for (const [emoji, str] of map) {
    changelog = changelog.replace(new RegExp(`(?<!${emoji})${str}`, 'g'), `${emoji}${str}`)
}

fs.writeFileSync(path, changelog)