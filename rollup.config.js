import path from 'path'
import buildins from 'builtin-modules'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

export default {
  input: path.resolve(__dirname, 'tjs/index.js'),
  output: {
    entryFileNames: 'index.js',
    preferConst: true,
    sourcemap: true,
    exports: 'auto'
  },
  external: [
    ...buildins
  ],
  plugins: [
    resolve(),
    commonjs({
      include: /node_modules/
    }),
    babel({
      babelHelpers: 'bundled'
    }),
  ]
}
