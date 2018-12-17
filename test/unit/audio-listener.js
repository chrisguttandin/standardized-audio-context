import '../helper/play-silence';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';

const testCases = {
    'a MinimalAudioContext': {
        createContext: createMinimalAudioContext
    },
    'a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext
    },
    'an AudioContext': {
        createContext: createAudioContext
    },
    'an OfflineAudioContext': {
        createContext: createOfflineAudioContext
    }
};

// @todo Skip about 50% of the test cases when running on Travis to prevent the browsers from crashing while running the tests.
if (process.env.TRAVIS) { // eslint-disable-line no-undef
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('AudioListener', () => {

    for (const [ description, { createContext } ] of Object.entries(testCases)) {

        describe(`with ${ description }`, () => {

            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => {
                context = createContext();
            });

            describe('forwardX', () => {

                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(listener.forwardX.cancelScheduledValues).to.be.a('function');
                    expect(listener.forwardX.defaultValue).to.equal(0);
                    expect(listener.forwardX.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardX.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardX.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.forwardX.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.forwardX.setTargetAtTime).to.be.a('function');
                    expect(listener.forwardX.setValueAtTime).to.be.a('function');
                    expect(listener.forwardX.setValueCurveAtTime).to.be.a('function');
                    expect(listener.forwardX.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.forwardX = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardX.cancelScheduledValues(0)).to.equal(listener.forwardX);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        listener.forwardX.value = 1;

                        expect(listener.forwardX.exponentialRampToValueAtTime(1, 0)).to.equal(listener.forwardX);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardX.linearRampToValueAtTime(1, 0)).to.equal(listener.forwardX);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardX.setTargetAtTime(1, 0, 0.1)).to.equal(listener.forwardX);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardX.setValueAtTime(1, 0)).to.equal(listener.forwardX);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardX.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(listener.forwardX);
                    });

                });

                // @todo automation

            });

            describe('forwardY', () => {

                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(listener.forwardY.cancelScheduledValues).to.be.a('function');
                    expect(listener.forwardY.defaultValue).to.equal(0);
                    expect(listener.forwardY.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardY.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardY.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.forwardY.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.forwardY.setTargetAtTime).to.be.a('function');
                    expect(listener.forwardY.setValueAtTime).to.be.a('function');
                    expect(listener.forwardY.setValueCurveAtTime).to.be.a('function');
                    expect(listener.forwardY.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.forwardY = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardY.cancelScheduledValues(0)).to.equal(listener.forwardY);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        listener.forwardY.value = 1;

                        expect(listener.forwardY.exponentialRampToValueAtTime(1, 0)).to.equal(listener.forwardY);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardY.linearRampToValueAtTime(1, 0)).to.equal(listener.forwardY);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardY.setTargetAtTime(1, 0, 0.1)).to.equal(listener.forwardY);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardY.setValueAtTime(1, 0)).to.equal(listener.forwardY);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardY.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(listener.forwardY);
                    });

                });

                // @todo automation

            });

            describe('forwardZ', () => {

                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(listener.forwardZ.cancelScheduledValues).to.be.a('function');
                    expect(listener.forwardZ.defaultValue).to.equal(-1);
                    expect(listener.forwardZ.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardZ.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardZ.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.forwardZ.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.forwardZ.setTargetAtTime).to.be.a('function');
                    expect(listener.forwardZ.setValueAtTime).to.be.a('function');
                    expect(listener.forwardZ.setValueCurveAtTime).to.be.a('function');
                    expect(listener.forwardZ.value).to.equal(-1);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.forwardZ = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardZ.cancelScheduledValues(0)).to.equal(listener.forwardZ);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        listener.forwardZ.value = 1;

                        expect(listener.forwardZ.exponentialRampToValueAtTime(1, 0)).to.equal(listener.forwardZ);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardZ.linearRampToValueAtTime(1, 0)).to.equal(listener.forwardZ);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardZ.setTargetAtTime(1, 0, 0.1)).to.equal(listener.forwardZ);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardZ.setValueAtTime(1, 0)).to.equal(listener.forwardZ);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.forwardZ.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(listener.forwardZ);
                    });

                });

                // @todo automation

            });

            describe('positionX', () => {

                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(listener.positionX.cancelScheduledValues).to.be.a('function');
                    expect(listener.positionX.defaultValue).to.equal(0);
                    expect(listener.positionX.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.positionX.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.positionX.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.positionX.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.positionX.setTargetAtTime).to.be.a('function');
                    expect(listener.positionX.setValueAtTime).to.be.a('function');
                    expect(listener.positionX.setValueCurveAtTime).to.be.a('function');
                    expect(listener.positionX.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.positionX = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionX.cancelScheduledValues(0)).to.equal(listener.positionX);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        listener.positionX.value = 1;

                        expect(listener.positionX.exponentialRampToValueAtTime(1, 0)).to.equal(listener.positionX);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionX.linearRampToValueAtTime(1, 0)).to.equal(listener.positionX);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionX.setTargetAtTime(1, 0, 0.1)).to.equal(listener.positionX);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionX.setValueAtTime(1, 0)).to.equal(listener.positionX);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionX.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(listener.positionX);
                    });

                });

                // @todo automation

            });

            describe('positionY', () => {

                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(listener.positionY.cancelScheduledValues).to.be.a('function');
                    expect(listener.positionY.defaultValue).to.equal(0);
                    expect(listener.positionY.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.positionY.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.positionY.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.positionY.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.positionY.setTargetAtTime).to.be.a('function');
                    expect(listener.positionY.setValueAtTime).to.be.a('function');
                    expect(listener.positionY.setValueCurveAtTime).to.be.a('function');
                    expect(listener.positionY.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.positionY = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionY.cancelScheduledValues(0)).to.equal(listener.positionY);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        listener.positionY.value = 1;

                        expect(listener.positionY.exponentialRampToValueAtTime(1, 0)).to.equal(listener.positionY);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionY.linearRampToValueAtTime(1, 0)).to.equal(listener.positionY);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionY.setTargetAtTime(1, 0, 0.1)).to.equal(listener.positionY);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionY.setValueAtTime(1, 0)).to.equal(listener.positionY);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionY.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(listener.positionY);
                    });

                });

                // @todo automation

            });

            describe('positionZ', () => {

                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(listener.positionZ.cancelScheduledValues).to.be.a('function');
                    expect(listener.positionZ.defaultValue).to.equal(0);
                    expect(listener.positionZ.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.positionZ.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.positionZ.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.positionZ.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.positionZ.setTargetAtTime).to.be.a('function');
                    expect(listener.positionZ.setValueAtTime).to.be.a('function');
                    expect(listener.positionZ.setValueCurveAtTime).to.be.a('function');
                    expect(listener.positionZ.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.positionZ = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionZ.cancelScheduledValues(0)).to.equal(listener.positionZ);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        listener.positionZ.value = 1;

                        expect(listener.positionZ.exponentialRampToValueAtTime(1, 0)).to.equal(listener.positionZ);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionZ.linearRampToValueAtTime(1, 0)).to.equal(listener.positionZ);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionZ.setTargetAtTime(1, 0, 0.1)).to.equal(listener.positionZ);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionZ.setValueAtTime(1, 0)).to.equal(listener.positionZ);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.positionZ.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(listener.positionZ);
                    });

                });

                // @todo automation

            });

            describe('upX', () => {

                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(listener.upX.cancelScheduledValues).to.be.a('function');
                    expect(listener.upX.defaultValue).to.equal(0);
                    expect(listener.upX.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.upX.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.upX.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.upX.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.upX.setTargetAtTime).to.be.a('function');
                    expect(listener.upX.setValueAtTime).to.be.a('function');
                    expect(listener.upX.setValueCurveAtTime).to.be.a('function');
                    expect(listener.upX.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.upX = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(listener.upX.cancelScheduledValues(0)).to.equal(listener.upX);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        listener.upX.value = 1;

                        expect(listener.upX.exponentialRampToValueAtTime(1, 0)).to.equal(listener.upX);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upX.linearRampToValueAtTime(1, 0)).to.equal(listener.upX);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upX.setTargetAtTime(1, 0, 0.1)).to.equal(listener.upX);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upX.setValueAtTime(1, 0)).to.equal(listener.upX);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upX.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(listener.upX);
                    });

                });

                // @todo automation

            });

            describe('upY', () => {

                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(listener.upY.cancelScheduledValues).to.be.a('function');
                    expect(listener.upY.defaultValue).to.equal(1);
                    expect(listener.upY.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.upY.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.upY.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.upY.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.upY.setTargetAtTime).to.be.a('function');
                    expect(listener.upY.setValueAtTime).to.be.a('function');
                    expect(listener.upY.setValueCurveAtTime).to.be.a('function');
                    expect(listener.upY.value).to.equal(1);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.upY = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(listener.upY.cancelScheduledValues(0)).to.equal(listener.upY);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        listener.upY.value = 1;

                        expect(listener.upY.exponentialRampToValueAtTime(1, 0)).to.equal(listener.upY);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upY.linearRampToValueAtTime(1, 0)).to.equal(listener.upY);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upY.setTargetAtTime(1, 0, 0.1)).to.equal(listener.upY);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upY.setValueAtTime(1, 0)).to.equal(listener.upY);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upY.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(listener.upY);
                    });

                });

                // @todo automation

            });

            describe('upZ', () => {

                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(listener.upZ.cancelScheduledValues).to.be.a('function');
                    expect(listener.upZ.defaultValue).to.equal(0);
                    expect(listener.upZ.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.upZ.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.upZ.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.upZ.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.upZ.setTargetAtTime).to.be.a('function');
                    expect(listener.upZ.setValueAtTime).to.be.a('function');
                    expect(listener.upZ.setValueCurveAtTime).to.be.a('function');
                    expect(listener.upZ.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.upZ = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(listener.upZ.cancelScheduledValues(0)).to.equal(listener.upZ);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        listener.upZ.value = 1;

                        expect(listener.upZ.exponentialRampToValueAtTime(1, 0)).to.equal(listener.upZ);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upZ.linearRampToValueAtTime(1, 0)).to.equal(listener.upZ);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upZ.setTargetAtTime(1, 0, 0.1)).to.equal(listener.upZ);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upZ.setValueAtTime(1, 0)).to.equal(listener.upZ);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(listener.upZ.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(listener.upZ);
                    });

                });

                // @todo automation

            });

        });

    }

});
