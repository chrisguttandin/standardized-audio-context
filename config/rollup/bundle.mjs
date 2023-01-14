import babel from '@rollup/plugin-babel';

// eslint-disable-next-line import/no-default-export
export default {
    input: 'build/es2019/module.js',
    output: {
        file: 'build/es5/bundle.js',
        format: 'umd',
        name: 'standardizedAudioContext'
    },
    plugins: [
        babel({
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
            plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-runtime'],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false
                    }
                ]
            ]
        })
    ]
};
