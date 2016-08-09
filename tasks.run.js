exports.lint = function () {

  cat('README.md');
  ls('.');
  exec(`eslint . --fix`);

  echo($5);

  exit(3);

};
