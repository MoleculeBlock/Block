'use strict';

const semver = require('semver')
const colors = require('colors/safe')
const log = require('@atuo/cli-log')
const pkg = require('../package.json')
const { LOWEST_NODE_VERSION } = require('./const')

module.exports = core;

function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
    } catch (error) {
        log.error(error.message)
    }

}

// 检查版本号
function checkPkgVersion() {
    log.info('cli', `V${pkg.version}`)
}

// 检查node版本号
function checkNodeVersion() {
    // 获取当前node版本号
    const currentVersion = process.version
        // 比对最低版本号
    if (!semver.gte(currentVersion, LOWEST_NODE_VERSION)) {
        throw new Error(colors.red(`脚手架需要安装 V${LOWEST_NODE_VERSION} 以上版本的 Node.js`))
    }
}