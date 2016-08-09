exports.lint = function () {

  ls('.');
  exec(`eslint . --fix`);

  echo($ret);

  exit(3);

};
