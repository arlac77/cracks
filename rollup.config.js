import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import executable from "rollup-plugin-executable";
import consts from "rollup-plugin-consts";

import builtins from "builtin-modules";
import { name, version, description, main, bin } from "./package.json";

export default {
  output: {
    file: bin,
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    interop: false
  },
  plugins: [ consts({
    name,
    version,
    description
  }),
 resolve(), commonjs(), executable()],
  external: [
    ...builtins
  ],
  input: main
};
