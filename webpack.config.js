const path = require('path');

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

module.exports = (env, argv) => {
    const mode = argv.mode;

    console.log("argv=", argv);
    console.log(path.resolve(__dirname, './dist'));
    const outFname = {
        'development': 'move.lab.dev.js',
        'production': 'move.lab.js'
    }[mode] || 'move.lab.js';

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
            path: path.resolve(__dirname, './dist'),
            module: true,
            library: {
                //name: 'move.lab',
                type: 'module',
            },
        },
    };
};