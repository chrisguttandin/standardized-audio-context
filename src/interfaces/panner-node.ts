import { TDistanceModelType, TPanningModelType } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IPannerNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    coneInnerAngle: number;

    coneOuterAngle: number;

    coneOuterGain: number;

    distanceModel: TDistanceModelType;

    maxDistance: number;

    readonly orientationX: IAudioParam;

    readonly orientationY: IAudioParam;

    readonly orientationZ: IAudioParam;

    panningModel: TPanningModelType;

    readonly positionX: IAudioParam;

    readonly positionY: IAudioParam;

    readonly positionZ: IAudioParam;

    refDistance: number;

    rolloffFactor: number;

}
