import babel from 'rollup-plugin-babel';

export default {
    dest: 'build/es5/bundle.js',
    entry: 'build/es2015/module.js',
    format: 'umd',
    moduleName: 'standardizedAudioContext',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [
                [
                    'es2015',
                    {
                        modules: false
                    }
                ]
            ]
        })
    ]
};
