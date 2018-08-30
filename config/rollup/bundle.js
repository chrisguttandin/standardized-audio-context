import babel from 'rollup-plugin-babel';

export default {
    input: 'build/es2015/module.js',
    output: {
        file: 'build/es5/bundle.js',
        format: 'umd',
        name: 'standardizedAudioContext'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
            plugins: [
                '@babel/plugin-external-helpers',
                '@babel/plugin-transform-runtime'
            ],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false
                    }
                ]
            ],
            runtimeHelpers: true
        })
    ]
};
