'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const path = require('path');
const NicePackage = require('nice-package');
const fetchNicePackage = require('fetch-nice-package');
const normalizeData = require('normalize-package-data');

module.exports = (() => {
  var _ref = _asyncToGenerator(function* (section) {
    let pkg = require(path.join(process.cwd(), 'package.json'));
    normalizeData(pkg);
    section.body = [];
    section.body.push('');
    section.body.push('```');
    // some facts
    var hasPrivate, hasRepo, hasMain, hasBin, hasGlobal;
    hasPrivate = Boolean(pkg.private);
    hasRepo = Boolean(pkg.repository && pkg.repository.type === 'git' && pkg.repository.url);
    hasMain = Boolean(pkg.main);
    hasBin = Boolean(pkg.bin);
    hasGlobal = Boolean(pkg.preferGlobal);
    // some logical derivation
    var fromWhere = '',
        optGlobal = '',
        optSave = '';
    // 'private' is used to prevent publishing. So installing from npm would be impossible.
    if (hasPrivate && hasRepo) {
      fromWhere = pkg.repository.url;
    }
    // if it's private, and does NOT have a repo, give up the ghost
    if (hasPrivate && !hasRepo) {
      throw new Error(`Cannot generate installation instructions for a private module with no 'repository' set in package.json`);
      // Note: I feel that fixing the package.json is outside the scope of this module's task. Obviously, if no repo.url
      // is set, then some other tool needs to correct that, and then and only then this module be run to update the README.
    }
    let npm = yield fetchNicePackage(pkg.name);
    normalizeData(npm);
    // If this package name already exists on npm with a different author, install from Github.
    // Otherwise, this module is or will be published on npm
    if (hasRepo && npm.valid && npm.author.name !== pkg.author.name) {
      fromWhere = pkg.repository.url;
    } else {
      fromWhere = pkg.name;
    }
    if (hasGlobal) {
      optGlobal = ' --global';
    } else {
      optSave = ' --save';
    }
    // finally
    section.body.push(`npm install ${fromWhere}${optGlobal}${optSave}`);
    section.body.push('```');
    section.body.push('');
    return;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();
module.exports.title = 'Installation';