'use strict';

const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const log = require('@atuo/cli-log')
const pkg = require('../package.json')
const { LOWEST_NODE_VERSION } = require('./const')

let args
module.exports = core;

function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgs()
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

// 检查root账户
function checkRoot() {
    const rootCheck = require('root-check')
    rootCheck()
}

// 检查用户主目录是否存在
function checkUserHome() {
    // 如果用户主目录不存在或者用户主目录文件是否存在
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登陆用户主目录不存在！'))
    }
}

// 判断参数是否开启debug模式
function checkInputArgs() {
    const minimist = require('minimist')
    args = minimist(process.argv.slice(2))
    checkArgs()
}

// 判断是否有debug参数
function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}