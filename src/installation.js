'use strict'
const path = require('path')
const normalizeData = require('normalize-package-data')

module.exports = function (sections) {
  for (let n in sections) {
    let headline = sections[n].split('\n', 1)
    headline = headline.length === 1 ? headline[0] : ''
    if (headline.match(/^#{1,2}\s*installation/i)) {
      let pkg = require(path.join(process.cwd(), 'package.json'))
      normalizeData(pkg)
      // some facts
      let hasPrivate = Boolean(pkg.private)
      let hasRepo = Boolean(pkg.repository && pkg.repository.type === 'git' && pkg.repository.url)
      let hasGlobal = Boolean(pkg.preferGlobal)
      // some logical derivation
      let fromWhere = ''
      let optGlobal = ''
      let optSave = ''
      // 'private' is used to prevent publishing. So installing from npm would be impossible.
      if (hasPrivate) {
        if (hasRepo) {
          fromWhere = pkg.repository.url
        } else {
          throw new Error(`Cannot generate installation instructions for a private module with no 'repository' set in package.json`)
        }
      } else {
        fromWhere = pkg.name
      }
      if (hasGlobal) {
        optGlobal = ' --global'
      } else {
        optSave = ' --save'
      }
      // finally
      sections[n] =
        [ headline,
          '',
          '```',
          `npm install ${fromWhere}${optGlobal}${optSave}`,
          '```',
          '',
          ''].join('\n')
    }
  }
  return sections
}
