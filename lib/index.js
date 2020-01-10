import fs from "fs";
import { promisify } from "util";
import execa from "execa";
import gitRefs from "git-refs";

const encodingOptions = { encoding: "utf8" };

export async function verify(opts, nextRelease) {
  let message;

  opts = { silent: true, paths: ["tests", "package.json"], ...opts };

  const type = nextRelease.type || opts.type;
  if (type === "major" || type === "initial") return null;

  try {
    action = "fetch tags";
    let result = await execa("git", [("fetch", "--tags")]);

    result = await execa("git", [("describe", "--abbrev=0", "--tags")]);

    action = "checkout paths";
    const refs = await promisify(gitRefs)();

    const cohash = refs.get(descErr ? "HEAD" : `tags/${stdout.trim()}`);

    result = await execa("git", ["checkout", cohash, ...opts.paths]);
    const pkg = JSON.parse(
      await fs.promises.readFile("package.json", encodingOptions)
    );
    const tmpDep = pkg.dependencies;
    delete pkg.dependencies;
    await fs.promises.writeFile(
      "package.json",
      JSON.stringify(pkg, undefined, 2) + "\n",
      encodingOptions
    );

    action = "install dependencies";
    result = await execa("npm", ["install"]);

    pkg.dependencies = tmpDep;
    await fs.promises.writeFile(
      "package.json",
      JSON.stringify(pkg, undefined, 2) + "\n",
      encodingOptions
    );

    const npmTest = await execa("npm", ["test"]);

    if (!opts.silent) {
      npmTest.stdout.pipe(process.stdout);
      npmTest.stderr.pipe(process.stderr);
    }

    result = await execa("git", ["stash"]);
    if (error) {
      if (opts.silent) {
        // When things go wrong we log no matter what
        console.error(stdout);
        console.error(stderr);
      }
      throw new Error("Old tests failed. Breaking Change detected.");
    }
  } catch (err) {
    throw new Error(`Could not ${action}: ${err}`);
  }
}


//export default verify;