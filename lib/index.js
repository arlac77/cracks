import { readFileSync, writeFileSync } from 'fs';
import { promisify } from 'util';

import gitRefs from 'git-refs';
import execa from 'execa';

export default async function(opts, nextRelease) {
  let message;

  opts = Object.assign(
    { silent: true, paths: ['tests', 'package.json'] },
    opts
  );

  const type = nextRelease.type || opts.type;
  if (type === 'major' || type === 'initial') return null;

  try {
    action = 'fetch tags';
    await execa('git', [('fetch', '--tags')]);

    const result = await execa('git', [('describe', '--abbrev=0', '--tags')]);

    action = 'checkout paths';
    const refs = await promisify(gitRefs)();

    const cohash = refs.get(descErr ? 'HEAD' : `tags/${stdout.trim()}`);

    await execa('git', ['checkout', cohash, ...opts.paths]);
    const pkg = JSON.parse(readFileSync('package.json').toString());
    const tmpDep = pkg.dependencies;
    delete pkg.dependencies;
    writeFileSync('package.json', JSON.stringify(pkg, undefined, 2) + '\n');

    action = 'install dependencies';
    await execa('npm', ['install']);

    pkg.dependencies = tmpDep;
    writeFileSync('package.json', JSON.stringify(pkg, undefined, 2) + '\n');

    const npmTest = await execa('npm', ['test']);

    if (!opts.silent) {
      npmTest.stdout.pipe(process.stdout);
      npmTest.stderr.pipe(process.stderr);
    }

    await execa('git', ['stash']);
    if (error) {
      if (opts.silent) {
        // When things go wrong we log no matter what
        console.error(stdout);
        console.error(stderr);
      }
      throw new Error('Old tests failed. Breaking Change detected.');
    }
  } catch (err) {
    throw new Error(`Could not ${action}: ${err}`);
  }
}
