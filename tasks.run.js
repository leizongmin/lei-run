register('info', function () {
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
  print(utils.date('Y-m-d H:i:s'));
  run('info');
  run('test');
});

register('publish', function () {
  exec('eslint . --fix');
  if ($ret === 0) {
    exec('npm publish');
  }
});

register('async', function () {
  aexec('say -v Ting-ting "启动本地测试程序"');
  run('info');
});
