const fs = require('fs')

const path = 'CHANGELOG.md'

const changelog = fs.readFileSync(path, { encoding: 'utf-8' })

const data = changelog.replace(/Bug Fixes/g, '🐛Bug Fixes').replace(/Features/g, '✨Features')

fs.writeFileSync(path, data)