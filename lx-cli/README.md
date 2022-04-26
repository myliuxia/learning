## 编写一个脚手架

### 流程分析
基于 vue-cli 的使用经验，我们来分析一下脚手架的基本实现流程:

- 首先我们要初始化一个项目

  - 创建项目 zc-cli，配置项目所需的信息
  - npm link 项目至全局，这样本地可以临时调用指令


- 项目开发

  - 基础指令配置: 例如 --help --version 等
  - 复杂指令配置: create 指令
  - 实现命令行交互功能: 基于 inquirer 实现命令行交互
  - 拉取项目模板
  - 根据用户的选择动态生成项目

## 使用的三方库

- commander —— 命令行指令配置
- chalk —— 命令行美化工具
- inquirer —— 命令行交互工具
- ora —— 命令行 loading 效果
- fs-extra —— 更友好的文件操作
- download-git-repo —— 命令行下载工具
- figlet —— 生成基于 ASCII 的艺术字