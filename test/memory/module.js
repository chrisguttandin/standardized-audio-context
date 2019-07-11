const MemoryFileSystem = require('memory-fs'); // eslint-disable-line no-undef
const puppeteer = require('puppeteer'); // eslint-disable-line no-undef
const webpack = require('webpack'); // eslint-disable-line no-undef

// eslint-disable-next-line padding-line-between-statements
const compileBundle = () => {
    return new Promise((resolve, reject) => {
        const memoryFileSystem = new MemoryFileSystem();
        const compiler = webpack({
            entry: {
                bundle: './build/es2018/module.js'
            },
            mode: 'development',
            output: {
                filename: '[name].js',
                libraryTarget: 'umd',
                path: '/'
            }
        });

        compiler.outputFileSystem = memoryFileSystem;
        compiler.run((err, stats) => {
            if (stats.hasErrors() || stats.hasWarnings()) {
                reject(new Error(stats.toString({ errorDetails: true, warnings: true })));
            } else {
                resolve(memoryFileSystem.readFileSync('/bundle.js', 'utf-8')); // eslint-disable-line no-sync
            }
        });
    });
};
const countObjects = async (page) => {
    const prototypeHandle = await page.evaluateHandle(() => Object.prototype);
    const objectsHandle = await page.queryObjects(prototypeHandle);
    const numberOfObjects = await page.evaluate((instances) => instances.length, objectsHandle);

    await Promise.all([
        prototypeHandle.dispose(),
        objectsHandle.dispose()
    ]);

    return numberOfObjects;
};

describe('module', () => {

    let browser;
    let context;
    let page;

    after(() => browser.close());

    afterEach(() => context.close());

    before(async function () {
        this.timeout(10000);

        browser = await puppeteer.launch();
    });

    beforeEach(async function () {
        this.timeout(10000);

        context = await browser.createIncognitoBrowserContext();
        page = await context.newPage();

        await page.evaluate(await compileBundle());
        await page.evaluate(async () => {
            audioContext = new AudioContext(); // eslint-disable-line no-undef

            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
    });

    describe('with a GainNode', () => {

        it('should collect unconnected GainNodes', async function () {
            this.timeout(10000);

            const run = (numberOfIterations) => {
                for (let i = 0; i < numberOfIterations; i += 1) {
                    new GainNode(audioContext); // eslint-disable-line no-undef
                }
            };
            const numberOfObjects = await countObjects(page);

            await page.evaluate(run, 1000);

            expect(await countObjects(page)).to.equal(numberOfObjects);
        });

        it('should collect connected GainNodes', async function () {
            this.timeout(10000);

            const run = (numberOfIterations) => {
                for (let i = 0; i < numberOfIterations; i += 1) {
                    const gainNode = new GainNode(audioContext); // eslint-disable-line no-undef

                    gainNode.connect(audioContext.destination); // eslint-disable-line no-undef
                }
            };
            const numberOfObjects = await countObjects(page);

            await page.evaluate(run, 1000);

            expect(await countObjects(page)).to.equal(numberOfObjects);
        });

        it('should collect disconnected GainNodes', async function () {
            this.timeout(10000);

            const run = (numberOfIterations) => {
                for (let i = 0; i < numberOfIterations; i += 1) {
                    const gainNode = new GainNode(audioContext); // eslint-disable-line no-undef

                    gainNode.connect(audioContext.destination); // eslint-disable-line no-undef
                    gainNode.disconnect(audioContext.destination); // eslint-disable-line no-undef
                }
            };
            const numberOfObjects = await countObjects(page);

            await page.evaluate(run, 1000);

            expect(await countObjects(page)).to.equal(numberOfObjects);
        });

    });

    describe('with an AudioBufferSourceNode', () => {

        it('should collect unconnected AudioBufferSourceNodes', async function () {
            this.timeout(10000);

            const run = (numberOfIterations) => {
                for (let i = 0; i < numberOfIterations; i += 1) {
                    new AudioBufferSourceNode(
                        audioContext, // eslint-disable-line no-undef
                        { buffer: new AudioBuffer({ length: 1, sampleRate: audioContext.sampleRate }) } // eslint-disable-line no-undef
                    );
                }
            };

            // Run the test once because the first run will trigger some memoizations.
            await page.evaluate(run, 1);

            const numberOfObjects = await countObjects(page);

            await page.evaluate(run, 1000);

            expect(await countObjects(page)).to.equal(numberOfObjects);
        });

        it('should collect connected AudioBufferSourceNodes', async function () {
            this.timeout(10000);

            const run = (numberOfIterations) => {
                for (let i = 0; i < numberOfIterations; i += 1) {
                    const audioBufferSourceNode = new AudioBufferSourceNode(
                        audioContext, // eslint-disable-line no-undef
                        { buffer: new AudioBuffer({ length: 1, sampleRate: audioContext.sampleRate }) } // eslint-disable-line no-undef
                    );

                    audioBufferSourceNode.connect(audioContext.destination); // eslint-disable-line no-undef
                }
            };

            // Run the test once because the first run will trigger some memoizations.
            await page.evaluate(run, 1);

            const numberOfObjects = await countObjects(page);

            await page.evaluate(run, 1000);

            expect(await countObjects(page)).to.equal(numberOfObjects);
        });

        // @todo Run a test with started AudioBufferSourceNodes.

        it('should collect disconnected AudioBufferSourceNodes', async function () {
            this.timeout(10000);

            const run = (numberOfIterations) => {
                for (let i = 0; i < numberOfIterations; i += 1) {
                    const audioBufferSourceNode = new AudioBufferSourceNode(
                        audioContext, // eslint-disable-line no-undef
                        { buffer: new AudioBuffer({ length: 1, sampleRate: audioContext.sampleRate }) } // eslint-disable-line no-undef
                    );

                    audioBufferSourceNode.connect(audioContext.destination); // eslint-disable-line no-undef
                    audioBufferSourceNode.disconnect(audioContext.destination); // eslint-disable-line no-undef
                }
            };

            // Run the test once because the first run will trigger some memoizations.
            await page.evaluate(run, 1);

            const numberOfObjects = await countObjects(page);

            await page.evaluate(run, 1000);

            expect(await countObjects(page)).to.equal(numberOfObjects);
        });

    });

});
