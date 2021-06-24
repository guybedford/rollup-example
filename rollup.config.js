import path from 'path';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import rimraf from 'rimraf';

rimraf.sync('./lib/chunks');

export default {
  input: {
    'lib/p1/app.js': 'lib/p1/app.ts',
    'lib/p2/app.js': 'lib/p2/app.ts'
  },
  output: {
    entryFileNames: '[name]',
    chunkFileNames: 'lib/chunks/[name]-[hash].js',
    dir: '.',
    sourcemap: true
  },
  plugins: [{
    resolveId (id, parentId) {
      if (id.startsWith('../external/'))
        return { id, external: true };
      if (!id.endsWith('.js') && !id.endsWith('.ts'))
        return path.resolve(path.dirname(parentId), id + '.ts');
    }
  }, typescript(), terser({
    mangle: false,
    output: {
      preamble: `/*!
 * EGroupware (http://www.egroupware.org/) minified Javascript
 *
 * full sources are available under https://github.com/EGroupware/egroupware/
 *
 * build ${Date.now()}
 */
`
    }
  })]
};
