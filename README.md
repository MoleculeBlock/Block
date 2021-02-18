# lerna 常用命令

## 初始化项目

`lerna init`

## 初始化packages

`lerna create packages-name path`

## 在packages下 安装包

`lerna add package path`

## 删除 packages下所有的node_modules 文件

`lerna clean`

## 安装所有包下的依赖

`lerna bootstrap`

## 包软连接

`lerna link`

# 发布流程注意事项

* 每次发布都需要登陆 npm login
* 每个package.json 都需要添加 [publishConfig配置](https://github.com/lerna/lerna/tree/main/commands/publish#publishconfigaccess)
