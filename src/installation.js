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
      var hasPrivate, hasRepo, hasMain, hasBin, hasGlobal
      hasPrivate = Boolean(pkg.private)
      hasRepo = Boolean(pkg.repository && pkg.repository.type === 'git' && pkg.repository.url)
      hasMain = Boolean(pkg.main)
      hasBin = Boolean(pkg.bin)
      hasGlobal = Boolean(pkg.preferGlobal)
      // some logical derivation
      var fromWhere = '', optGlobal = '', optSave = ''
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
        [ headline
        , ''
        , '```'
        , `npm install ${fromWhere}${optGlobal}${optSave}`
        , '```'
        , ''
        , ''].join('\n')
    }
  }
  return sections
}
