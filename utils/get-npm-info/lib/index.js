'use strict';

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')
    // 获取版本信息
function getNpmInfo(npmName, registry) {
    if (!npmName) {
        return null
    }

    const registryLink = registry || getDefaultRegistry(true)
    const npmInfoUrl = urlJoin(registryLink, npmName)
    return axios.get(npmInfoUrl).then(res => {
        if (res.status === 200) {
            return res.data
        } else {
            return null
        }
    }).catch(err => {
        return Promise.reject(err)
    })
}
// 默认npm api url
function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}
// 获取版本号
async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry)
    if (data) {
        return Object.keys(data.versions)
    } else {
        return []
    }
}

function getSemverVersions(baseVersion, versions) {
    return versions.filter(version =>
        semver.satisfies(version, `>${baseVersion}`)
    ).sort((a, b) => semver.gt(b, a) ? 1 : -1)
}
// 获取满足条件的版本号
async function getNpmSemverVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersions(npmName, registry)
    const newVersion = getSemverVersions(baseVersion, versions)
    if (newVersion && newVersion.length > 0) {
        return newVersion[0]
    }
}

module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersion
}