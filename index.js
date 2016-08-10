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
const clc = require('cli-color');
const shell = require('shelljs');

// 内置模块
global.fs = require('fs');
global.path = require('path');
global.assert = require('assert');
global.os = require('os');

// color
global.clc = clc;

// shell命令
global.shell = shell;
Object.keys(shell).forEach(name => {
  global[name] = function () {

    line();
    const args = Array.prototype.slice.call(arguments);
    log([ name ].concat(args).join(' '));

    const r = shell[name].apply(shell, args);
    if (r.stdout) {
      console.log(r.stdout);
    }
    if (r.stderr) {
      warn(r.stderr);
    }
    if (r.code !== 0) {
      warn('with exit code ' + r.code);
    }

    return r;
  };
});

// exec命令
global.exec = function (cmd, opts) {
  line();
  log(cmd);
  try {
    child_process.execSync(cmd, Object.assign({
      stdio: [ 1, 2, 3 ],
    }, opts));
    global.$ret = 0;
  } catch (err) {
    warn(err.message);
    warn('with exit code ' + err.status);
    global.$ret = err.status;
  }
  return global.$ret;
};
// 上一个命令的结束码
global.$ret = 0;

// echo命令
global.echo = function (msg) {
  console.log(msg);
};
// print命令
global.print = global.echo;

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
  console.log(clc.green('run: ' + msg));
}

function warn(msg) {
  console.log(clc.yellow('run: ' + msg));
}

function error(msg) {
  console.log('');
  console.log(clc.red('run: ' + msg));
  console.log('');
}

function die(msg, code) {
  error(msg);
  process.exit(code || 1);
}

function line(n) {
  const size = n || 4;
  let str = '';
  for (let i = 0; i < size; i++) {
    str += '==========';
  }
  console.log(clc.blackBright(str));
}

// 进程退出信息
process.on('exit', function (code) {
  line(8);
  if (code === 0) {
    log(`all done. (in ${ process.uptime() }s)`);
  } else {
    error('exit code ' + code);
  }
});

// 异常信息
process.on('uncaughtException', function (err) {
  error('uncaughtException: ' + (err && err.stack));
});
process.on('unhandledRejection', function (err) {
  error('unhandledRejection: ' + (err && err.stack));
});

// 查找当前目录下的 tasks.run.js 文件
const file = path.resolve('tasks.run.js');
if (!fs.existsSync(file)) {
  die('no targets specified and no "tasks.run.js" found.  Stop.');
}

// 获取构建目标
const target = process.argv[2] || 'all';
global.target = target;

const tasks = global.tasks = {};

// 注册任务
global.register = function (name, handler) {
  if (tasks[name]) die(`task "${ name }" has been registered.  Stop.`);
  if (typeof handler !== 'function') die(`task handler "${ name }" is not a function.  Stop.`);
  tasks[name] = handler;
};

// 执行任务
global.run = function (name) {
  const t = process.uptime();
  line(8);
  const handler = tasks[name];
  if (!handler) die(`task "${ name } not found.  Stop.`);
  log('task "${ name }" starting...');
  handler();
  const s = process.uptime() - t;
  log(`task "${ name }" done. (in ${ s.toFixed(3) }s)`);
};

// 载入任务文件
try {
  require(file);
} catch (err) {
  console.log(err && err.stack);
  die('failed to load "tasks.run.js".  Stop.');
}

global.run(target);
