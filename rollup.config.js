import pkg from './package.json';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import executable from "rollup-plugin-executable";
import builtins from "builtin-modules";

export default {
  output: {
    file: pkg.bin,
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    interop: false
  },
  plugins: [resolve(), commonjs(), json(), executable()],
  external: [
    ...builtins
  ],
  input: pkg.main
};
