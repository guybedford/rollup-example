import path from 'path';
import babel from '@babel/core';
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
  }, {
    transform (code, id) {
      if (id.endsWith('.ts'))
        return new Promise((resolve, reject) => {
          return babel.transform(code, {
            filename: id,
            sourceMaps: true,
            ast: false,
            compact: false,
            sourceType: 'module',
            parserOpts: {
              // plugins: stage3Syntax,
              errorRecovery: true
            },
            presets: ['@babel/preset-typescript']
          }, function (err, result) {
            if (err)
              return reject(err);
            resolve(result);
          });  
        });
    }
  }, terser({
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
