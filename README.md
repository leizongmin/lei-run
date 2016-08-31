# 基于Node.js的构建工具


## 安装

```bash
$ npm install -g lei-run
```


## 使用

在当前目录新建文件`tasks.run.js`：

```javascript
// 注册任务test
register('test', function () {

  // 执行命令
  exec(`eslint . --fix`);
  // 通过$ret获取上一个命令返回的结束代码，默认为0
  print($ret);

  // 顺序执行多条命令，详当于 cmd1 && cmd2 && cmd3
  mexec([
    'ls .',
    'cat README.md',
  ]);

  // 可通过argv得到启动参数数组
  // 通过env得到环境变量对象
  // 另外启动参数也可以同$N获得（N是0到9的数字）
  print($5);

  // 可以通过clc获取cli-color模块，用于输出带颜色的文字
  print(clc.green(`hello, world`));

  // 结束程序并返回指定代码
  // exit(3);

  // 另外可以执行任意Node.js代码
  // 比如require('xxx')载入其他模块

  // 以下内置模块已自动载入，直接使用模块名即可：fs、os、path、assert
  // 比如print(os.cpus());

});

// 注册任务test2
register('test2', function () {

  // 打印出所有参数
  for (const v of argv) {
    print(v);
  }

});

// 注册任务all
register('all', function () {

  // 分别之前以上两个任务
  run('test');
  run('test2');

});
```

然后可以通过以下命令执行任务`test`：

```bash
$ run test
```

如果当前目录没有`tasks.run.js`文件，也可执行以下命令自动生成一个初始的文件：

```bash
$ run --init
```

## API

### 全局模块

+ `fs` - https://nodejs.org/api/fs.html
+ `path` - https://nodejs.org/api/path.html
+ `assert` - https://nodejs.org/api/assert.html
+ `os` - https://nodejs.org/api/os.html
+ `shell` - https://www.npmjs.com/package/shelljs
+ `rd` - https://www.npmjs.com/package/rd
+ `color` - https://www.npmjs.com/package/cli-color
+ `utils` - https://www.npmjs.com/package/lei-utils

可直接使用，比如：

```javascript
console.log(os.cpus());
```

### 注册任务

+ `register(name, handler)` - 注册任务
+ `run(name)` - 执行任务
+ `target` - 构建目标

### 全局函数

+ `exec(cmd[, opts])` - 以同步方式执行命令，并自动打印结果，返回命令的结束代码（成功为`0`）
+ `mexec(cmds[, opts])` - 使用`exec()`依次执行多条命令，如果有命令返回的代码不为`0`则返回
+ `print(msg)` - 打印内容到控制台
+ `onExit(fn)` - 当进程退出时执行

### 全局变量

+ `env` - 环境变量
+ `argv` - 启动参数
+ `$0` ~ `$9` - 第`0`至`9`个启动参数
+ `$ret` - 上一条使用`exec()`执行的命令的返回代码
+ `pwd` - 当前工作目录，如果改变改变量的值也会改变当前工作目录
+ `uptime` - 进程已启动的时间（秒）

## License

```
MIT License

Copyright (c) 2016 Zongmin Lei <leizongmin@mail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
