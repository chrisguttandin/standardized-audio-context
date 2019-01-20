import { MOST_NEGATIVE_SINGLE_FLOAT, MOST_POSITIVE_SINGLE_FLOAT } from '../constants';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IPannerNode, IPannerOptions } from '../interfaces';
import { TContext, TDistanceModelType, TNativePannerNode, TPannerNodeConstructorFactory, TPanningModelType } from '../types';

const DEFAULT_OPTIONS: IPannerOptions = {
    channelCount: 2,
    channelCountMode: 'clamped-max',
    channelInterpretation: 'speakers',
    coneInnerAngle: 360,
    coneOuterAngle: 360,
    coneOuterGain: 0,
    distanceModel: 'inverse',
    maxDistance: 10000,
    orientationX: 1,
    orientationY: 0,
    orientationZ: 0,
    panningModel: 'equalpower',
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    refDistance: 1,
    rolloffFactor: 1
};

export const createPannerNodeConstructor: TPannerNodeConstructorFactory = (
    createAudioParam,
    createInvalidStateError,
    createNativePannerNode,
    createPannerNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class PannerNode extends noneAudioDestinationNodeConstructor implements IPannerNode {

        private _nativePannerNode: TNativePannerNode;

        private _orientationX: IAudioParam;

        private _orientationY: IAudioParam;

        private _orientationZ: IAudioParam;

        private _positionX: IAudioParam;

        private _positionY: IAudioParam;

        private _positionZ: IAudioParam;

        constructor (context: TContext, options: Partial<IPannerOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativePannerNode = createNativePannerNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const pannerNodeRenderer = (isOffline) ? createPannerNodeRenderer() : null;

            super(context, nativePannerNode, pannerNodeRenderer);

            this._nativePannerNode = nativePannerNode;
            // Bug #74: Edge & Safari do not export the correct values for maxValue and minValue for GainNodes.
            this._orientationX = createAudioParam(
                context,
                isOffline,
                nativePannerNode.orientationX,
                MOST_POSITIVE_SINGLE_FLOAT,
                MOST_NEGATIVE_SINGLE_FLOAT
            );
            this._orientationY = createAudioParam(
                context,
                isOffline,
                nativePannerNode.orientationY,
                MOST_POSITIVE_SINGLE_FLOAT,
                MOST_NEGATIVE_SINGLE_FLOAT
            );
            this._orientationZ = createAudioParam(
                context,
                isOffline,
                nativePannerNode.orientationZ,
                MOST_POSITIVE_SINGLE_FLOAT,
                MOST_NEGATIVE_SINGLE_FLOAT
            );
            this._positionX = createAudioParam(
                context,
                isOffline,
                nativePannerNode.positionX,
                MOST_POSITIVE_SINGLE_FLOAT,
                MOST_NEGATIVE_SINGLE_FLOAT
            );
            this._positionY = createAudioParam(
                context,
                isOffline,
                nativePannerNode.positionY,
                MOST_POSITIVE_SINGLE_FLOAT,
                MOST_NEGATIVE_SINGLE_FLOAT
            );
            this._positionZ = createAudioParam(
                context,
                isOffline,
                nativePannerNode.positionZ,
                MOST_POSITIVE_SINGLE_FLOAT,
                MOST_NEGATIVE_SINGLE_FLOAT
            );
        }

        get coneInnerAngle (): number {
            return this._nativePannerNode.coneInnerAngle;
        }

        set coneInnerAngle (value) {
            this._nativePannerNode.coneInnerAngle = value;
        }

        get coneOuterAngle (): number {
            return this._nativePannerNode.coneOuterAngle;
        }

        set coneOuterAngle (value) {
            this._nativePannerNode.coneOuterAngle = value;
        }

        get coneOuterGain (): number {
            return this._nativePannerNode.coneOuterGain;
        }

        set coneOuterGain (value) {
            const previousChannelCount = this._nativePannerNode.coneOuterGain;

            this._nativePannerNode.coneOuterGain = value;

            // Bug #127: Edge, Opera & Safari do not throw an InvalidStateError yet.
            if (value < 0 || value > 1) {
                this._nativePannerNode.coneOuterGain = previousChannelCount;

                throw createInvalidStateError();
            }
        }

        get distanceModel (): TDistanceModelType {
            return this._nativePannerNode.distanceModel;
        }

        set distanceModel (value) {
            this._nativePannerNode.distanceModel = value;
        }

        get maxDistance (): number {
            return this._nativePannerNode.maxDistance;
        }

        set maxDistance (value) {
            this._nativePannerNode.maxDistance = value;
        }

        get orientationX (): IAudioParam {
            return this._orientationX;
        }

        get orientationY (): IAudioParam {
            return this._orientationY;
        }

        get orientationZ (): IAudioParam {
            return this._orientationZ;
        }

        get panningModel (): TPanningModelType {
            return this._nativePannerNode.panningModel;
        }

        set panningModel (value) {
            this._nativePannerNode.panningModel = value;
        }

        get positionX (): IAudioParam {
            return this._positionX;
        }

        get positionY (): IAudioParam {
            return this._positionY;
        }

        get positionZ (): IAudioParam {
            return this._positionZ;
        }

        get refDistance (): number {
            return this._nativePannerNode.refDistance;
        }

        set refDistance (value) {
            this._nativePannerNode.refDistance = value;
        }

        get rolloffFactor (): number {
            return this._nativePannerNode.rolloffFactor;
        }

        set rolloffFactor (value) {
            const previousRolloffFactor = this._nativePannerNode.rolloffFactor;

            this._nativePannerNode.rolloffFactor = value;

            // Bug #130: Edge, Opera & Safari do not throw a RangeError yet.
            if (value < 0) {
                this._nativePannerNode.rolloffFactor = previousRolloffFactor;

                throw new RangeError();
            }
        }

    };

};
