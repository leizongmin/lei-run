#!/usr/bin/env node

'use strict';

/**
 * run
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const color = require('cli-color');
const shell = require('shelljs');
const rd = require('rd');
const utils = require('lei-utils');

// 内置模块
global.fs = require('fs');
global.path = require('path');
global.assert = require('assert');
global.os = require('os');
global.shell = shell;
global.rd = rd;
global.color = color;
global.utils = utils;

// exec命令
global.exec = function (cmd, opts) {
  line();
  log(cmd);
  emptyLine();
  const execOpts = Object({}, opts);
  execOpts.stdio = execOpts.stdio || [ 0, 1, 2 ];
  execOpts.env = Object.assign({}, execOpts.env || process.env || {});
  execOpts.env.PATH = path.resolve('./node_modules/.bin') + ':' + execOpts.env.PATH;
  try {
    child_process.execSync(cmd, execOpts);
    global.$ret = 0;
  } catch (err) {
    emptyLine();
    warn(err.message);
    warn('with exit code ' + err.status);
    global.$ret = err.status;
  }
  return global.$ret;
};
// 上一个命令的结束码
global.$ret = 0;

// 顺序执行多条命令，如果其中一个失败则直接返回
global.mexec = function (cmds, opts) {
  for (const cmd of cmds) {
    if (global.exec(cmd, opts) !== 0) {
      break;
    }
  }
  return global.$ret;
};

// print命令
global.print = console.log;

// 启动参数
global.argv = process.argv.slice(3);
global.argv.forEach((v, i) => {
  global['$' + i] = v;
});
for (let i = 0; i < 10; i++) {
  if (typeof global['$' + i] === 'undefined') {
    global['$' + i] = undefined;
  }
}

// 环境变量
global.env = process.env;

// 退出进程
global.exit = function (code) {
  process.exit(code);
};

// 打印信息
function log(msg) {
  console.log(color.blackBright('>>> ') + color.blackBright(msg));
}

function warn(msg) {
  console.log(color.blackBright('>>> ') + color.yellow(msg));
}

function error(msg) {
  emptyLine();
  console.log(color.blackBright('>>> ') + color.red(msg));
  emptyLine();
}

function die(msg, code) {
  error(msg);
  process.exit(code || 1);
}

function generateLine(n) {
  let str = '';
  for (let i = 0; i < n; i++) {
    str += '----------';
  }
  return color.blackBright(str);
}

function line() {
  console.log(generateLine(4));
}

function longLine() {
  emptyLine();
  console.log(generateLine(8));
  emptyLine();
}

function emptyLine() {
  console.log('');
}

// 异常信息
process.on('uncaughtException', function (err) {
  error('uncaughtException: ' + (err && err.stack));
});
process.on('unhandledRejection', function (err) {
  error('unhandledRejection: ' + (err && err.stack));
});

// 获取构建目标
const target = process.argv[2];
global.target = target;

const tasks = global.tasks = {};

// 注册任务
global.register = function (name, handler) {
  if (tasks[name]) die(`task "${ name }" has been registered.`);
  if (typeof handler !== 'function') die(`task handler "${ name }" is not a function.`);
  tasks[name] = handler;
};

// 执行任务
global.run = function (name) {
  const t = process.uptime();
  longLine();
  const handler = tasks[name];
  if (!handler) die(`task "${ name } not found.`);
  log(`task "${ name }" starting...`);
  emptyLine();
  handler();
  const s = process.uptime() - t;
  emptyLine();
  log(`task "${ name }" done. (in ${ s.toFixed(3) }s)`);
};

// 当前目录下的 tasks.run.js 文件
const file = path.resolve('tasks.run.js');

// 自动初始化 tasks.run.js 文件
function generateTasksFile() {
  emptyLine();
  if (fs.existsSync(file)) {
    die('file "tasks.run.js" is already exists.');
  }
  fs.writeFileSync(file, `
'use strict';

register('hello', function () {
  print('Hello, now is ' + color.yellow(utils.date('Y-m-d H:i:s')));
});
  `.trim());
  log(`write file "${ file }".`);
}

if (target === '--init') {
  generateTasksFile();
  process.exit();
}

// 检查 tasks.run.js 文件是否存在
if (!fs.existsSync(file)) {
  die('no "tasks.run.js" found.');
}

// 载入任务文件
try {
  require(file);
} catch (err) {
  console.log(err && err.stack);
  die('failed to load "tasks.run.js".');
}

// 显示tasks列表
function showTasks() {
  const names = Object.keys(tasks);
  if (names.length > 0) {
    emptyLine();
    console.log(`total ${ names.length } tasks:`);
    emptyLine();
    for (const name of names) {
      console.log('\t ' + color.blue(name));
    }
    emptyLine();
    console.log('type the following command to run a task:');
    emptyLine();
    console.log('\t ' + color.magenta.bold('run ' + color.blue('<task>')));
    emptyLine();
    console.log('for example:');
    emptyLine();
    console.log('\t ' + color.magenta.bold('run ' + color.blue(names[0])));
    emptyLine();
  } else {
    error('there is no task has been registered in file "tasks.run.js".');
  }
}

if (target) {

  // 进程退出信息
  process.on('exit', function (code) {
    longLine();
    if (code === 0) {
      log(`all done. (in ${ process.uptime() }s)`);
    } else {
      error('exit code ' + code);
    }
  });

  global.run(target);

} else {
  showTasks();
}
