'use strict';

const pkg = require('../package.json')
const log = require('@atuo/cli-log')

module.exports = core;

function core() {
    checkPkgVersion()
}

// 检查版本号
function checkPkgVersion() {
    log.info('cli', `V${pkg.version}`)
}