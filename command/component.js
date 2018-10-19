'use strict'
const co = require('co')
const fs = require('fs')
const chalk = require('chalk')
const config = require('../templates');

module.exports = () => {
    co(function*() {

        //从模板复制文件
        function copyTemplate(from, to) {
            from = path.join(__dirname, 'templates', from);
            write(to, fs.readFileSync(from, 'utf-8'))
        }

        function write(path, str, mode) {
            fs.writeFileSync(path, str)
        }

        //创建文件夹
        function mkdir(path, fn) {
            fs.mkdir(path, function(err) {
                fn && fn()
            })
        }

        //创建多层文件夹
        function createFolder(to) {
            var sep = '/';
            var folders = path.dirname(to).split(sep);
            var p = '';
            while (folders.length) {
                p += folders.shift() + sep;
                if (!fs.existsSync(p)) {
                    fs.mkdirSync(p);
                }
            }
        };

        //改写文件内容
        function resetFile(to, old, newtext, fn) {
            fs.readFile(to, function(err, data) {
                data = data + "";
                data = data.replace(old, newtext);
                fs.writeFile(to, data, function(err) {
                    if (err) {
                        console.log(chalk.red("error!" + to));
                    } else {
                        fn && fn()
                    }
                });
            });
        }

        //写入配置信息
        function updateConfigFile(ary) {
            fs.readFile("app-routing.ts", "utf8", function(error, data) {
                var tagetString = "import {" + compFolderName + "Component} " + "form 'app/" + compFolderName + "Component';" + "\n";
                //字符串替换
                /* if (error) {
                    fs.writeFile("app-routing.ts", tagetString + 'const routes: Routes=[]', (err) => {
                        if (err) console.log(err);
                    });
                }
                if (data) {
                    resetFile("app-routing.ts", 'const routes', tagetString + "const routes", function() {
                        console.log(chalk.green("app-routing.ts Saved !")); //文件被保存
                    })
                } */

                //正则插入
                if (error) {
                    fs.writeFile("app-routing.ts", tagetString + 'const routes: Routes=[]', (err) => {
                        if (err) console.log(err);
                    });
                }
                if (data) {
                    /* var reg1 = /([/][^/]+)$/; */
                    var reg1 = /(['import'][^'import']+)$/;
                    var beforeData = data.replace(reg1, "");
                    var reg2 = /([^'import']+)$/;
                    var afterData = data.match(reg2)[1];
                    console.log('beforeData=====');
                    console.log(beforeData);
                    console.log('afterData====')
                    console.log(afterData)
                        /* resetFile("app-routing.ts", 'const routes', tagetString + "const routes", function() {
                            console.log(chalk.green("app-routing.ts Saved !")); //文件被保存
                        }) */
                }
            })
        }

        var path = require('path');
        var PATH = ".";
        // 获取组件名称
        let componentName = process.argv.slice(3)[0];
        var targetUrlAry = componentName.split('/');
        var compFolderName = targetUrlAry[targetUrlAry.length - 1];

        createFolder(componentName);
        /* 方法1：模板创建文件 */
        mkdir(PATH + '/' + componentName, function() {
            copyTemplate("../../templates/templates.css", PATH + '/' + componentName + '/' + compFolderName + '.css');
            copyTemplate("../../templates/templates.html", PATH + '/' + componentName + '/' + compFolderName + '.html');
            copyTemplate("../../templates/templates.ts", PATH + '/' + componentName + '/' + compFolderName + '.ts');
            resetFile(PATH + '/' + componentName + '/' + compFolderName + '.html', 'application', compFolderName, function() {
                resetFile(PATH + '/' + componentName + '/' + compFolderName + '.ts', 'selectorName', compFolderName, function() {
                    resetFile(PATH + '/' + componentName + '/' + compFolderName + '.ts', 'templateUrlName', compFolderName, function() {
                        resetFile(PATH + '/' + componentName + '/' + compFolderName + '.ts', 'styleUrlsName', compFolderName, function() {
                            resetFile(PATH + '/' + componentName + '/' + compFolderName + '.ts', 'nameComponent', compFolderName);
                        });
                    });
                });
            });
            console.log(chalk.green(compFolderName + ' component created!'));
        });

        /* 方法2：直接创建文件 */
        /* mkdir(PATH + '/' + componentName, function() {
            fs.writeFile(PATH + '/' + componentName + '/' + compFolderName + '.css', '', function(err) {
                if (err) console.error(err);
            });
            fs.writeFile(PATH + '/' + componentName + '/' + compFolderName + '.html', '<p><br>' + componentName + '<br></p>', function(err) {
                if (err) console.error(err);
            });
            fs.writeFile(PATH + '/' + componentName + '/' + compFolderName + '.ts', '', function(err) {
                if (err) console.error(err);
            });
            console.log(chalk.green(compFolderName + 'component created!'));
        }); */

        //配置信息更新
        if (!config.compAry[compFolderName]) {
            config.compAry[compFolderName] = {}
            config.compAry[compFolderName]['name'] = compFolderName;
            config.compAry[compFolderName]['isAuto'] = process.argv.slice(4)[0] == 'autoset' ? true : false;
            // 把组件信息写入templates.json
            fs.writeFile(__dirname + '/../templates.json', JSON.stringify(config), 'utf-8', (err) => {
                if (err) console.log(err)
            })
            if (process.argv.slice(4)[0] == 'autoset') {
                updateConfigFile(compFolderName);
            }
        } else {
            console.log(chalk.red('The component has already existed!'));
            process.exit();
        }

    })
}