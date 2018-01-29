import pkg from './package.json';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
export default {
  output: {
    file: pkg.bin,
    format: 'cjs',
    banner: '#!/usr/bin/env node'
  },
  plugins: [resolve(), commonjs(), json()],
  external: ['fs', 'util', 'path'],
  input: pkg.main
};
