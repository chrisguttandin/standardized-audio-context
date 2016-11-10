module.exports = function (config) {

    config.set({

        basePath: '../../',

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
