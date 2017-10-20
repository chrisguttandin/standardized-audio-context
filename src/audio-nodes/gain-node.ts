import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core'; // tslint:disable-line:ordered-imports
import { RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioParam, IGainNode, IGainOptions, IMinimalBaseAudioContext } from '../interfaces';
import { GainNodeRenderer } from '../renderers/gain-node';
import { TChannelCountMode, TChannelInterpretation } from '../types';
import { AudioParamWrapper } from '../wrappers/audio-param';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = ReflectiveInjector.resolveAndCreate([
    AudioParamWrapper
]);

const audioParamWrapper = injector.get(AudioParamWrapper);

const DEFAULT_OPTIONS: IGainOptions = {
    channelCount: 2, // @todo channelCount is not specified because it is ignored when the channelCountMode equals 'max'.
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    gain: 1,
    numberOfInputs: 1,
    numberOfOutputs: 1
};

export class GainNode extends NoneAudioDestinationNode implements IGainNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IGainOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = nativeContext.createGain();

        super(context, nativeNode, mergedOptions);

        if (isOfflineAudioContext(nativeContext)) {
            const gainNodeRenderer = new GainNodeRenderer(this);

            RENDERER_STORE.set(this, gainNodeRenderer);

            audioParamWrapper.wrap(nativeNode, 'gain');
        }
    }

    public get gain (): IAudioParam {
        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        return <IAudioParam> (<any> this._nativeNode).gain;
    }

}
