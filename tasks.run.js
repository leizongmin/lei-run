exports.lint = function () {

  ls('.');
  exec(`eslint . --fix`);

  echo(clc.green($ret));

  exit(3);

};
