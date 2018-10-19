'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')

module.exports = () => {
    co(function*() {
        // 处理用户输入
        let tplName;
        if (process.argv.slice(3)[0] && process.argv.slice(3)[0] == 'selTemp') {
            tplName = yield prompt('Template name: ');
            if (!config.tpl[tplName]) {
                console.log(chalk.red('\n × Template does not exit!'))
                process.exit()
            }
        } else {
            tplName = 'ms';
        }

        let projectName = yield prompt('Project name: ')
        let gitUrl
        let branch

        gitUrl = config.tpl[tplName].url
        branch = config.tpl[tplName].branch

        // 关键的一句代码,git命令，远程拉取项目并自定义项目名
        let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`

        console.log(chalk.white('\n Start generating...'))

        exec(cmdStr, (error, stdout, stderr) => {
            if (error) {
                console.log(error)
                process.exit()
            }
            console.log(chalk.green('\n √ Generation completed!'))
            console.log(`\n cd ${projectName} && npm install \n`)
            process.exit()
        })
    })
}