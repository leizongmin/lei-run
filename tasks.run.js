register('info', function () {
  ls('.');
  cat('README.md');
  const cpus = os.cpus();
  for (const cpu of cpus) {
    print(cpu.model);
  }
});

register('test', function () {
  exec('npm info');
  exec('npm test');
});

register('all', function () {
  run('info');
  run('test');
});