#!/usr/bin/env node

'use strict';

/**
 * run
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const path = require('path');
const child_process = require('child_process');

// 启动主进程
const mainFile = path.resolve(__dirname, 'main.js');
const main = child_process.fork(mainFile, process.argv.slice(2));
main.on('close', () => {
  process.exit();
});

// 接收异步执行命令信息
main.on('message', msg => {
  exec(msg.cmd, msg.execOpts || {});
});

function exec(cmd, execOpts) {
  line();
  log(cmd);
  emptyLine();
  execOpts.stdio = execOpts.stdio || [ 0, 1, 2 ];
  execOpts.env = Object.assign({}, execOpts.env || process.env || {});
  execOpts.env.PATH = path.resolve('./node_modules/.bin') + ':' + execOpts.env.PATH;
  try {
    child_process.execSync(cmd, execOpts);
  } catch (err) {
    emptyLine();
    warn(err.message);
    warn('with exit code ' + err.status);
  }
}

const color = require('cli-color');
const utils = require('lei-utils');

// 返回当前时间字符串
function time() {
  return utils.date('[H:i:s]');
}

// 打印信息
function log(msg) {
  console.log(color.blackBright(`>>> ${ time() }\t`) + color.blackBright(msg));
}

function warn(msg) {
  console.log(color.blackBright(`>>> ${ time() }\t`) + color.yellow(msg));
}

function error(msg) {
  emptyLine();
  console.log(color.blackBright(`>>> ${ time() }\t`) + color.red(msg));
  emptyLine();
}

// eslint-disable-next-line
function die(msg, code) {
  error(msg);
  process.exit(code || 1);
}

function line() {
  console.log(generateLine(4));
}

function generateLine(n) {
  let str = '';
  for (let i = 0; i < n; i++) {
    str += '----------';
  }
  return color.blackBright(str);
}

// eslint-disable-next-line
function longLine() {
  emptyLine();
  console.log(generateLine(8));
  emptyLine();
}

function emptyLine() {
  console.log('');
}
