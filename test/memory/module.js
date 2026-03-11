const { join } = require('path'); // eslint-disable-line no-undef
const { createWriteStream } = require('fs'); // eslint-disable-line no-undef
const MemoryFileSystem = require('memory-fs'); // eslint-disable-line no-undef
const puppeteer = require('puppeteer'); // eslint-disable-line no-undef
const webpack = require('webpack'); // eslint-disable-line no-undef

// eslint-disable-next-line padding-line-between-statements
const compileBundle = () => {
    return new Promise((resolve, reject) => {
        const memoryFileSystem = new MemoryFileSystem();
        const compiler = webpack({
            entry: {
                bundle: './build/es2019/module.js'
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
            if (err !== null) {
                reject(err);
            } else if (stats.hasErrors() || stats.hasWarnings()) {
                reject(new Error(stats.toString({ errorDetails: true, warnings: true })));
            } else {
                resolve(memoryFileSystem.readFileSync('/bundle.js', 'utf8')); // eslint-disable-line node/no-sync
            }
        });
    });
};
const countObjects = async (page) => {
    let previousNumberOfObjects = null;

    while (true) {
        await page.evaluate(() => gc({ execution: 'sync', flavor: 'last-resort', type: 'major' })); // eslint-disable-line no-undef

        const prototypeHandle = await page.evaluateHandle(() => Object.prototype);
        const objectsHandle = await page.queryObjects(prototypeHandle);
        const numberOfObjects = await page.evaluate((instances) => instances.length, objectsHandle);

        await Promise.all([prototypeHandle.dispose(), objectsHandle.dispose()]);

        if (numberOfObjects === previousNumberOfObjects) {
            return numberOfObjects;
        }

        previousNumberOfObjects = numberOfObjects;

        await new Promise((resolve) => {
            setTimeout(resolve, 100);
        });
    }
};
const takeHeapSnapshot = async (page) => {
    const client = await page.target().createCDPSession();

    await client.send('HeapProfiler.enable');

    // eslint-disable-next-line no-undef
    const heapSnapshotStream = createWriteStream(join(__dirname, 'test.heapsnapshot'), { encoding: 'utf8' });

    client.on('HeapProfiler.addHeapSnapshotChunk', ({ chunk }) => {
        heapSnapshotStream.write(chunk);
    });

    await client.send('HeapProfiler.takeHeapSnapshot', { reportProgress: false });
    await new Promise((resolve) => {
        heapSnapshotStream.end(() => resolve());
    });
    await client.send('HeapProfiler.disable');
};

describe('module', () => {
    let browser;
    let context;
    let page;

    after(() => browser.close());

    afterEach(() => context.close());

    before(async function () {
        this.timeout(10000);

        browser = await puppeteer.launch({
            args: ['--js-flags=--expose-gc']
        });
    });

    beforeEach(async function () {
        this.timeout(10000);

        context = await browser.createBrowserContext();
        page = await context.newPage();

        await page.evaluate(await compileBundle());
        await page.evaluate(async () => {
            await isSupported(); // eslint-disable-line no-undef

            audioContext = new AudioContext(); // eslint-disable-line no-undef

            await new Promise((resolve) => {
                // eslint-disable-next-line no-undef
                audioContext.onstatechange = () => {
                    // eslint-disable-next-line no-undef
                    if (audioContext.state === 'running') {
                        // eslint-disable-next-line no-undef
                        audioContext.onstatechange = null;

                        resolve();
                    }
                };
            });
        });
    });

    describe('with a GainNode', () => {
        describe('with unconnected GainNodes', () => {
            let run;

            beforeEach(() => {
                run = (numberOfIterations) => {
                    for (let i = 0; i < numberOfIterations; i += 1) {
                        new GainNode(audioContext); // eslint-disable-line no-undef
                    }
                };
            });

            it('should collect all GainNodes', async function () {
                this.timeout(10000);

                // Run the test once because the first run will trigger some memoizations.
                await page.evaluate(run, 1000);

                const numberOfObjects = await countObjects(page);

                await page.evaluate(run, 1000);

                try {
                    expect(await countObjects(page)).to.equal(numberOfObjects);
                } catch (err) {
                    await takeHeapSnapshot(page);

                    throw err;
                }
            });
        });

        describe('with connected GainNodes', () => {
            let run;

            beforeEach(() => {
                run = (numberOfIterations) => {
                    for (let i = 0; i < numberOfIterations; i += 1) {
                        const gainNode = new GainNode(audioContext); // eslint-disable-line no-undef

                        gainNode.connect(audioContext.destination); // eslint-disable-line no-undef
                    }
                };
            });

            it('should collect all GainNodes', async function () {
                this.timeout(10000);

                // Run the test once because the first run will trigger some memoizations.
                await page.evaluate(run, 1000);

                const numberOfObjects = await countObjects(page);

                await page.evaluate(run, 1000);

                try {
                    expect(await countObjects(page)).to.equal(numberOfObjects);
                } catch (err) {
                    await takeHeapSnapshot(page);

                    throw err;
                }
            });
        });

        describe('with disconnected GainNodes', () => {
            let run;

            beforeEach(() => {
                run = (numberOfIterations) => {
                    for (let i = 0; i < numberOfIterations; i += 1) {
                        const gainNode = new GainNode(audioContext); // eslint-disable-line no-undef

                        gainNode.connect(audioContext.destination); // eslint-disable-line no-undef
                        gainNode.disconnect(audioContext.destination); // eslint-disable-line no-undef
                    }
                };
            });

            it('should collect all GainNodes', async function () {
                this.timeout(10000);

                // Run the test once because the first run will trigger some memoizations.
                await page.evaluate(run, 1000);

                const numberOfObjects = await countObjects(page);

                await page.evaluate(run, 1000);

                try {
                    expect(await countObjects(page)).to.equal(numberOfObjects);
                } catch (err) {
                    await takeHeapSnapshot(page);

                    throw err;
                }
            });
        });
    });

    describe('with an AudioBufferSourceNode', () => {
        describe('with unconnected AudioBufferSourceNodes', () => {
            let run;

            beforeEach(() => {
                run = (numberOfIterations) => {
                    for (let i = 0; i < numberOfIterations; i += 1) {
                        new AudioBufferSourceNode(
                            audioContext, // eslint-disable-line no-undef
                            { buffer: new AudioBuffer({ length: 1, sampleRate: audioContext.sampleRate }) } // eslint-disable-line no-undef
                        );
                    }
                };
            });

            it('should collect all AudioBufferSourceNodes', async function () {
                this.timeout(10000);

                // Run the test once because the first run will trigger some memoizations.
                await page.evaluate(run, 1000);

                const numberOfObjects = await countObjects(page);

                await page.evaluate(run, 1000);

                try {
                    expect(await countObjects(page)).to.equal(numberOfObjects);
                } catch (err) {
                    await takeHeapSnapshot(page);

                    throw err;
                }
            });
        });

        describe('with connected AudioBufferSourceNodes', () => {
            let run;

            beforeEach(() => {
                run = (numberOfIterations) => {
                    for (let i = 0; i < numberOfIterations; i += 1) {
                        const audioBufferSourceNode = new AudioBufferSourceNode(
                            audioContext, // eslint-disable-line no-undef
                            { buffer: new AudioBuffer({ length: 1, sampleRate: audioContext.sampleRate }) } // eslint-disable-line no-undef
                        );

                        audioBufferSourceNode.connect(audioContext.destination); // eslint-disable-line no-undef
                    }
                };
            });

            it('should collect all AudioBufferSourceNodes', async function () {
                this.timeout(10000);

                // Run the test once because the first run will trigger some memoizations.
                await page.evaluate(run, 1000);

                const numberOfObjects = await countObjects(page);

                await page.evaluate(run, 1000);

                try {
                    expect(await countObjects(page)).to.equal(numberOfObjects);
                } catch (err) {
                    await takeHeapSnapshot(page);

                    throw err;
                }
            });
        });

        // @todo Run a test with started AudioBufferSourceNodes.

        describe('with disconnected AudioBufferSourceNodes', () => {
            let run;

            beforeEach(() => {
                run = (numberOfIterations) => {
                    for (let i = 0; i < numberOfIterations; i += 1) {
                        const audioBufferSourceNode = new AudioBufferSourceNode(
                            audioContext, // eslint-disable-line no-undef
                            { buffer: new AudioBuffer({ length: 1, sampleRate: audioContext.sampleRate }) } // eslint-disable-line no-undef
                        );

                        audioBufferSourceNode.connect(audioContext.destination); // eslint-disable-line no-undef
                        audioBufferSourceNode.disconnect(audioContext.destination); // eslint-disable-line no-undef
                    }
                };
            });

            it('should collect all AudioBufferSourceNodes', async function () {
                this.timeout(10000);

                // Run the test once because the first run will trigger some memoizations.
                await page.evaluate(run, 1000);

                const numberOfObjects = await countObjects(page);

                await page.evaluate(run, 1000);

                try {
                    expect(await countObjects(page)).to.equal(numberOfObjects);
                } catch (err) {
                    await takeHeapSnapshot(page);

                    throw err;
                }
            });
        });
    });
});
