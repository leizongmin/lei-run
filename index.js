#!/usr/bin/env node

'use strict';

/**
 * run
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const clc = require('cli-color');
const shell = require('shelljs');

// shell命令
global.shell = shell;
Object.keys(shell).forEach(name => {
  global[name] = function () {
    console.log(clc.blackBright('================================================================'));
    const args = Array.prototype.slice.call(arguments);
    log([ name ].concat(args).join(' '));
    const r = shell[name].apply(shell, args);
    if (r.stdout) {
      console.log(r.stdout);
    }
    if (r.stderr) {
      console.error(clc.yellow(r.stderr));
    }
    if (r.code !== 0) {
      console.error(clc.yellow('Exit ' + r.code));
    }
  };
});

// 启动参数
global.argv = process.argv.slice(3);
global.argv.forEach((v, i) => {
  global['$' + i] = v;
});

// 环境变量
global.env = process.env;

// 退出进程
global.exit = function (code) {
  const c = code || 0;
  die('Exit code ' + c, c);
};

// 打印信息
function log(msg) {
  console.log(clc.green('run: ' + msg));
}

function die(msg, code) {
  console.log('');
  console.log(clc.red('run: ' + msg));
  console.log('');
  process.exit(code || 1);
}

// 查找当前目录下的 tasks.run.js 文件
const file = path.resolve('tasks.run.js');
if (!fs.existsSync(file)) {
  die('*** No targets specified and no "tasks.run.js" found.  Stop.');
}

// 获取构建目标
const target = process.argv[2];
global.target = target;
if (!target) {
  die('*** No targets specified and no "tasks.run.js" found.  Stop.');
}

// 载入任务文件
let tasks;
try {
  tasks = require(file);
} catch (err) {
  console.log(err && err.stack);
  die('Failed to load "tasks.run.js".  Stop.');
}

const method = tasks[target];
if (typeof method !== 'function') {
  die('*** No targets specified and no "tasks.run.js" found.  Stop.');let a;
}

log('target ' + target);
method();
