module.exports = (config) => {

    config.set({

        basePath: '../../',

        browserNoActivityTimeout: 240000,

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        singleRun: true,

        webpack: {
            module: {
                loaders: [
                    {
                        loader: 'ts-loader',
                        test: /\.ts?$/
                    }
                ]
            },
            resolve: {
                extensions: [ '.js', '.ts' ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    });

};
