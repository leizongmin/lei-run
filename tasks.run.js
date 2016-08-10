register('lint', function () {
  ls('.');
  exec(`eslint . --fix`);
  echo(clc.green($ret));
});

register('cpus', function () {
  echo(os.cpus());
});

register('all', function () {
  run('lint');
  run('cpus');
});
