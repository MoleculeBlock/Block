'use strict';

const log = require('npmlog')

// 根据参数判断时候展示 verbose
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'
    // 命令行前缀
log.heading = 'atuo'
    // 自定义 log 模式
log.addLevel('success', 2000, { fg: 'green', bold: true })

module.exports = log