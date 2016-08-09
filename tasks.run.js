exports.lint = function () {

  cat('README.md');
  ls('.');
  exec(`eslint . --fix`);

  exit(2);

};
