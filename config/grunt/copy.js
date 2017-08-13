module.exports = {
    ts: {
        files: [
            {
                cwd: 'src/',
                dest: 'build/ts/',
                expand: true,
                src: [ '**/*.ts' ]
            }
        ]
    }
};
