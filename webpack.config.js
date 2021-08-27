import path from 'path';
//const path = require('path');

const reservedTerms = [
    // package name
    'move', 
    // plugins
    'MoveLab', 'BaseAnimationPlugin',
    // updaters
    'BaseAnimationUpdater', 'LinearAnimationUpdater',
    'ParabolicAnimationUpdater',
    // linear aliases
    'Line', 'Continuous', 'Linear',
    // parabolic aliases
    'Parabolic', 'Boomerang', 'Arc',
  ];

export default (env, argv) => {
    const mode = argv.mode;

    /*console.log("argv=", argv);
    console.log(path.resolve(path.dirname('.'), './dist'));*/
    const outFname = {
        'development': 'move.lab.dev.mjs',
        'production': 'move.lab.mjs'
    }[mode] || 'move.lab.mjs';

    const info = [
        'move.lab.js -- Simple animation plugin for lab.js',
        '               We move lab!',
        '(C) 2021- Bruno Moreira-Guedes'
    ].join('\n');

    return {
        mode: mode === 'development' ? 'development' : 'production',
        devtool: mode === 'development' ? 'eval-source-map' : 'source-map',
        entry: [
            './src/updaters/BaseAnimationUpdater.mjs',
            './src/plugins/BaseAnimationPlugin.mjs',
            './src/updaters/LinearAnimationUpdater.mjs',
            './src/updaters/ParabolicAnimationUpdater.mjs',
            './src/plugins/MoveLab.mjs',
        ],
        experiments: {
            outputModule: true,
        },
        output: {
            filename: outFname,
            path: path.resolve(path.dirname('.'), './dist'),
            module: true,
            library: {
                //name: 'move.lab',
                type: 'module',
            },
        },
        externals: {
            lodash: {
                /*commonjs: 'lodash',
                commonjs2: 'lodash',
                amd: 'lodash',*/
                //module: 'lodash',
                root: '_',
            },
        }
        /*optimization: {
            runtimeChunk: 'single',
        },*/
    };
};