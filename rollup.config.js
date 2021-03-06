import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import executable from "rollup-plugin-executable";
import consts from "rollup-plugin-consts";

import builtins from "builtin-modules";
import { name, version, description, main, bin } from "./package.json";

const external = [...builtins, "execa","minimist","git-refs"];
const plugins = [
  consts({
    name,
    version,
    description
  }),
  resolve(),
  commonjs(),
  executable()
];

export default [
  {
    output: {
      file: bin,
      format: "cjs",
      banner: "#!/usr/bin/env node",
      interop: false
    },
    plugins: [...plugins, executable()],
    external,
    input: "lib/cli.js"
  },
  {
    output: {
      file: main,
      format: "cjs",
      interop: false
    },
    plugins,
    external,
    input: "lib/index.js"
  }
];
