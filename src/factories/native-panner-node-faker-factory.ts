import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { interceptConnections } from '../helpers/intercept-connections';
import { INativeWaveShaperNodeFaker } from '../interfaces';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TNativeAudioNode,
    TNativePannerNode,
    TNativePannerNodeFakerFactoryFactory
} from '../types';

export const createNativePannerNodeFakerFactory: TNativePannerNodeFakerFactoryFactory = (
    createNativeAudioNode,
    createNativeChannelMergerNode,
    createNativeGainNode,
    createNativeScriptProcessorNode,
    createNativeWaveShaperNode,
    createNotSupportedError
) => {
    return (
        nativeContext,
        {
            coneInnerAngle,
            coneOuterAngle,
            coneOuterGain,
            distanceModel,
            maxDistance,
            orientationX,
            orientationY,
            orientationZ,
            panningModel,
            positionX,
            positionY,
            positionZ,
            refDistance,
            rolloffFactor,
            ...audioNodeOptions
        }
    ) => {
        const pannerNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createPanner());

        // Bug #125: Safari does not throw an error yet.
        if (audioNodeOptions.channelCount > 2) {
            throw createNotSupportedError();
        }

        // Bug #126: Safari does not throw an error yet.
        if (audioNodeOptions.channelCountMode === 'max') {
            throw createNotSupportedError();
        }

        assignNativeAudioNodeOptions(pannerNode, audioNodeOptions);

        const SINGLE_CHANNEL_OPTIONS = {
            channelCount: 1,
            channelCountMode: <TChannelCountMode> 'explicit',
            channelInterpretation: <TChannelInterpretation> 'discrete'
        };

        const channelMergerNode = createNativeChannelMergerNode(
            nativeContext,
            { channelCount: 1, channelCountMode: 'explicit', channelInterpretation: 'speakers', numberOfInputs: 6 }
        );
        const inputGainNode = createNativeGainNode(nativeContext, { ...audioNodeOptions, gain: 1 });
        const orientationXGainNode = createNativeGainNode(nativeContext, { ...SINGLE_CHANNEL_OPTIONS, gain: 1 });
        const orientationYGainNode = createNativeGainNode(nativeContext, { ...SINGLE_CHANNEL_OPTIONS, gain: 0 });
        const orientationZGainNode = createNativeGainNode(nativeContext, { ...SINGLE_CHANNEL_OPTIONS, gain: 0 });
        const positionXGainNode = createNativeGainNode(nativeContext, { ...SINGLE_CHANNEL_OPTIONS, gain: 0 });
        const positionYGainNode = createNativeGainNode(nativeContext, { ...SINGLE_CHANNEL_OPTIONS, gain: 0 });
        const positionZGainNode = createNativeGainNode(nativeContext, { ...SINGLE_CHANNEL_OPTIONS, gain: 0 });
        const scriptProcessorNode = createNativeScriptProcessorNode(nativeContext, 256, 6, 0);
        const waveShaperNode = createNativeWaveShaperNode(
            nativeContext,
            { ...SINGLE_CHANNEL_OPTIONS, curve: new Float32Array([ 1, 1 ]), oversample: 'none' }
        );

        let lastOrientation = [ 1, 0, 0 ];
        let lastPosition = [ 0, 0, 0 ];

        scriptProcessorNode.onaudioprocess = ({ inputBuffer }) => { // tslint:disable-line:deprecation
            const orientation: [ number, number, number ] = [
                inputBuffer.getChannelData(0)[0],
                inputBuffer.getChannelData(1)[0],
                inputBuffer.getChannelData(2)[0]
            ];

            if (orientation.some((value, index) => (value !== lastOrientation[index]))) {
                pannerNode.setOrientation(...orientation); // tslint:disable-line:deprecation

                lastOrientation = orientation;
            }

            const positon: [ number, number, number ] = [
                inputBuffer.getChannelData(6)[0],
                inputBuffer.getChannelData(7)[0],
                inputBuffer.getChannelData(8)[0]
            ];

            if (positon.some((value, index) => (value !== lastPosition[index]))) {
                pannerNode.setPosition(...positon); // tslint:disable-line:deprecation

                lastPosition = positon;
            }
        };

        inputGainNode.connect(pannerNode);

        // Bug #119: Safari does not fully support the WaveShaperNode.
        inputGainNode.connect(((<INativeWaveShaperNodeFaker> waveShaperNode).inputs === undefined)
            ? waveShaperNode
            : (<INativeWaveShaperNodeFaker> waveShaperNode).inputs[0]);

        waveShaperNode.connect(orientationXGainNode);
        waveShaperNode.connect(orientationYGainNode);
        waveShaperNode.connect(orientationZGainNode);
        waveShaperNode.connect(positionXGainNode);
        waveShaperNode.connect(positionYGainNode);
        waveShaperNode.connect(positionZGainNode);

        orientationXGainNode.connect(channelMergerNode);
        orientationYGainNode.connect(channelMergerNode);
        orientationZGainNode.connect(channelMergerNode);

        positionXGainNode.connect(channelMergerNode);
        positionYGainNode.connect(channelMergerNode);
        positionZGainNode.connect(channelMergerNode);

        channelMergerNode.connect(scriptProcessorNode);

        Object.defineProperty(orientationYGainNode.gain, 'defaultValue', { get: () => 0 });
        Object.defineProperty(orientationZGainNode.gain, 'defaultValue', { get: () => 0 });
        Object.defineProperty(positionXGainNode.gain, 'defaultValue', { get: () => 0 });
        Object.defineProperty(positionYGainNode.gain, 'defaultValue', { get: () => 0 });
        Object.defineProperty(positionZGainNode.gain, 'defaultValue', { get: () => 0 });

        const nativePannerNodeFaker = {
            get bufferSize (): undefined {
                return undefined;
            },
            get channelCount (): number {
                return pannerNode.channelCount;
            },
            set channelCount (value) {
                // Bug #125: Safari does not throw an error yet.
                if (value > 2) {
                    throw createNotSupportedError();
                }

                inputGainNode.channelCount = value;
                pannerNode.channelCount = value;
            },
            get channelCountMode (): TNativePannerNode['channelCountMode'] {
                return pannerNode.channelCountMode;
            },
            set channelCountMode (value) {
                // Bug #126: Safari does not throw an error yet.
                if (value === 'max') {
                    throw createNotSupportedError();
                }

                inputGainNode.channelCountMode = value;
                pannerNode.channelCountMode = value;
            },
            get channelInterpretation (): TNativePannerNode['channelInterpretation'] {
                return pannerNode.channelInterpretation;
            },
            set channelInterpretation (value) {
                inputGainNode.channelInterpretation = value;
                pannerNode.channelInterpretation = value;
            },
            get coneInnerAngle (): TNativePannerNode['coneInnerAngle'] {
                return pannerNode.coneInnerAngle;
            },
            set coneInnerAngle (value) {
                pannerNode.coneInnerAngle = value;
            },
            get coneOuterAngle (): TNativePannerNode['coneOuterAngle'] {
                return pannerNode.coneOuterAngle;
            },
            set coneOuterAngle (value) {
                pannerNode.coneOuterAngle = value;
            },
            get coneOuterGain (): TNativePannerNode['coneOuterGain'] {
                return pannerNode.coneOuterGain;
            },
            set coneOuterGain (value) {
                pannerNode.coneOuterGain = value;
            },
            get context (): TNativePannerNode['context'] {
                return pannerNode.context;
            },
            get distanceModel (): TNativePannerNode['distanceModel'] {
                return pannerNode.distanceModel;
            },
            set distanceModel (value) {
                pannerNode.distanceModel = value;
            },
            get inputs (): TNativeAudioNode[] {
                return [ inputGainNode ];
            },
            get maxDistance (): TNativePannerNode['maxDistance'] {
                return pannerNode.maxDistance;
            },
            set maxDistance (value) {
                // Bug #128: Edge & Safari do not throw an error yet.
                if (value < 0) {
                    throw new RangeError();
                }

                pannerNode.maxDistance = value;
            },
            get numberOfInputs (): number {
                return pannerNode.numberOfInputs;
            },
            get numberOfOutputs (): number {
                return pannerNode.numberOfOutputs;
            },
            get orientationX (): TNativePannerNode['orientationX'] {
                return orientationXGainNode.gain;
            },
            get orientationY (): TNativePannerNode['orientationY'] {
                return orientationYGainNode.gain;
            },
            get orientationZ (): TNativePannerNode['orientationZ'] {
                return orientationZGainNode.gain;
            },
            get panningModel (): TNativePannerNode['panningModel'] {
                return pannerNode.panningModel;
            },
            set panningModel (value) {
                pannerNode.panningModel = value;

                // Bug #123: Edge does not support HRTF as panningModel.
                if (pannerNode.panningModel !== value && value === 'HRTF') {
                    throw createNotSupportedError();
                }
            },
            get positionX (): TNativePannerNode['positionX'] {
                return positionXGainNode.gain;
            },
            get positionY (): TNativePannerNode['positionY'] {
                return positionYGainNode.gain;
            },
            get positionZ (): TNativePannerNode['positionZ'] {
                return positionZGainNode.gain;
            },
            get refDistance (): TNativePannerNode['refDistance'] {
                return pannerNode.refDistance;
            },
            set refDistance (value) {
                // Bug #129: Edge & Safari do not throw an error yet.
                if (value < 0) {
                    throw new RangeError();
                }

                pannerNode.refDistance = value;
            },
            get rolloffFactor (): TNativePannerNode['rolloffFactor'] {
                return pannerNode.rolloffFactor;
            },
            set rolloffFactor (value) {
                // Bug #130: Edge, Opera & Safari do not throw an error yet.
                if (value < 0) {
                    throw new RangeError();
                }

                pannerNode.rolloffFactor = value;
            },
            addEventListener (...args: any[]): void {
                return inputGainNode.addEventListener(args[0], args[1], args[2]);
            },
            dispatchEvent (...args: any[]): boolean {
                return inputGainNode.dispatchEvent(args[0]);
            },
            removeEventListener (...args: any[]): void {
                return inputGainNode.removeEventListener(args[0], args[1], args[2]);
            }
        };

        if (coneInnerAngle !== undefined) {
            nativePannerNodeFaker.coneInnerAngle = coneInnerAngle;
        }

        if (coneOuterAngle !== undefined) {
            nativePannerNodeFaker.coneOuterAngle = coneOuterAngle;
        }

        if (coneOuterGain !== undefined) {
            nativePannerNodeFaker.coneOuterGain = coneOuterGain;
        }

        if (distanceModel !== undefined) {
            nativePannerNodeFaker.distanceModel = distanceModel;
        }

        if (maxDistance !== undefined) {
            nativePannerNodeFaker.maxDistance = maxDistance;
        }

        if (orientationX !== nativePannerNodeFaker.orientationX.value) {
            nativePannerNodeFaker.orientationX.value = orientationX;
        }

        if (orientationY !== nativePannerNodeFaker.orientationY.value) {
            nativePannerNodeFaker.orientationY.value = orientationY;
        }

        if (orientationZ !== nativePannerNodeFaker.orientationZ.value) {
            nativePannerNodeFaker.orientationZ.value = orientationZ;
        }

        if (panningModel !== undefined) {
            nativePannerNodeFaker.panningModel = panningModel;
        }

        if (positionX !== nativePannerNodeFaker.positionX.value) {
            nativePannerNodeFaker.positionX.value = positionX;
        }

        if (positionY !== nativePannerNodeFaker.positionY.value) {
            nativePannerNodeFaker.positionY.value = positionY;
        }

        if (positionZ !== nativePannerNodeFaker.positionZ.value) {
            nativePannerNodeFaker.positionZ.value = positionZ;
        }

        if (refDistance !== undefined) {
            nativePannerNodeFaker.refDistance = refDistance;
        }

        if (rolloffFactor !== undefined) {
            nativePannerNodeFaker.rolloffFactor = rolloffFactor;
        }

        return interceptConnections(nativePannerNodeFaker, pannerNode);
    };
};
