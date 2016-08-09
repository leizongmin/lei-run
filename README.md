# 基于Node.js的构建工具


## 安装

```bash
$ npm install -g lei-run
```


## 使用

在当前目录新建文件`tasks.run.js`：

```javascript
// 构建目标是 test
exports.test = function () {

  // 命令列表可以参考shelljs
  // https://www.npmjs.com/package/shelljs
  // 与shelljs的区别是，命令执行完毕后会自动打印结果
  cat(`README.md`);
  ls(`.`);

  // 另外可以通过shell对象操作shelljs
  shelljs.ls(`.`);

  // exec和echo命令有改动，使用方法基本相同
  exec(`eslint . --fix`);
  // 通过$ret获取上一个命令返回的结束代码，默认为0
  echo($ret);

  // 可通过argv得到启动参数数组
  // 通过env得到环境变量对象
  // 另外启动参数也可以同$N获得（N是0到9的数字）
  echo($5);

  // 可以通过clc获取cli-color模块，用于输出带颜色的文字
  echo(clc.green(`hello, world`));

  // 结束程序并返回指定代码
  exit(3);

  // 另外可以执行任意Node.js代码
  // 比如require('xxx')载入其他模块

};
```

然后可以通过以下命令执行`test`：

```bash
$ run test
```


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
