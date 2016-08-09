exports.lint = function () {

  ls('.');
  exec(`eslint . --fix`);

  echo(clc.green($ret));

  echo(os.cpus());

  exit(3);

};
