# pro-git
通过git自动下载某些项目模版
# 使用

##  默认有两个模板的Git地址，通过pro-git list命令可查看模板名称

### 查看已有的项目模板
pro-git list
***

### 据默认模板创建本地项目
pro-git init  
***

### 据指定模板创建本地项目
pro-git init  selTemp
***

### 类似ng g component，创建一组文件
pro-git component 路径+文件名          (如 pro-git component a/b/c)
***

### 类似ng g component，创建一组文件,并修改app-routing.ts文件
pro-git component 路径+文件名 autoset  (如 pro-git component a/b/c autoset)
***
