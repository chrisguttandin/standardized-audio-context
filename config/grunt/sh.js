module.exports = () => {
    return {
        'build': {
            cmd: 'npm run build'
        },
        'test-expectation-chrome': {
            cmd: 'npm run test:expectation-chrome'
        },
        'test-expectation-chrome-canary': {
            cmd: 'npm run test:expectation-chrome-canary'
        },
        'test-expectation-chrome-penultimate': {
            cmd: 'npm run test:expectation-chrome-penultimate'
        },
        'test-expectation-chrome-previous': {
            cmd: 'npm run test:expectation-chrome-previous'
        },
        'test-expectation-firefox': {
            cmd: 'npm run test:expectation-firefox'
        },
        'test-expectation-firefox-developer': {
            cmd: 'npm run test:expectation-firefox-developer'
        },
        'test-expectation-firefox-penultimate': {
            cmd: 'npm run test:expectation-firefox-penultimate'
        },
        'test-expectation-firefox-previous': {
            cmd: 'npm run test:expectation-firefox-previous'
        },
        'test-expectation-safari': {
            cmd: 'npm run test:expectation-safari'
        },
        'test-expectation-safari-penultimate': {
            cmd: 'npm run test:expectation-safari-penultimate'
        },
        'test-expectation-safari-previous': {
            cmd: 'npm run test:expectation-safari-previous'
        },
        'test-integration-browser': {
            cmd: 'npm run test:integration-browser'
        },
        'test-integration-node': {
            cmd: 'npm run test:integration-node'
        },
        'test-memory': {
            cmd: 'npm run test:memory'
        },
        'test-unit': {
            cmd: 'npm run test:unit'
        }
    };
};
