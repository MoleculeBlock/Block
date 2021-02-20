'use strict';

const path = require('path')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const log = require('@atuo/cli-log')
const pkg = require('../package.json')
const { LOWEST_NODE_VERSION, DEFAULT_CLI_HOME } = require('./const')

let args
module.exports = core;

async function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgs()
        checkEnv()
        await checkGlobalUpdate()
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

// 检查环境变量
function checkEnv() {
    const dotenv = require('dotenv')
    const dotenvPath = path.resolve(userHome, '.env')
    if (pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath
        })
    } else {

    }
    createDefaultConfig()
    log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

// 创建默认.env 文件
function createDefaultConfig() {
    const cliConfig = {
        home: DEFAULT_CLI_HOME
    }
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome.process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome, DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}

// 检查是否是最新脚手架版本
async function checkGlobalUpdate() {
    // 获取当前版本号和模块名
    const currentPkgVersion = pkg.version
    const pkgName = pkg.name
        // 调用npm API 获取所有版本号
    const { getNpmSemverVersion } = require('@atuo/cli-get-npm-info')
        // 比对当前版本号与npm 版本号
    const lastVersion = await getNpmSemverVersion(currentPkgVersion, pkgName)
        // 得出最新版本号给出提示
    if (lastVersion && semver.gt(lastVersion, currentPkgVersion)) {
        log.warn(colors.yellow(`请手动更新 ${pkgName}, 当前版本：${currentPkgVersion}, 最新版本：${lastVersion}
          更新命令：npm install -g ${pkgName}`))
    }
}