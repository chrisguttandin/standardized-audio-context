import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core'; // tslint:disable-line:ordered-imports
import { EventTarget } from '../event-target';
import { InvalidAccessErrorFactory } from '../factories/invalid-access-error';
import { AUDIO_NODE_STORE, CONTEXT_STORE, RENDERER_STORE } from '../globals';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioNode, IAudioNodeOptions, IAudioNodeRenderer, IMinimalBaseAudioContext } from '../interfaces';
import { DisconnectingSupportTester } from '../support-testers/disconnecting';
import { TChannelCountMode, TChannelInterpretation, TNativeAudioNode } from '../types';
import { AudioNodeDisconnectMethodWrapper } from '../wrappers/audio-node-disconnect-method';

const injector = ReflectiveInjector.resolveAndCreate([
    AudioNodeDisconnectMethodWrapper,
    DisconnectingSupportTester,
    InvalidAccessErrorFactory
]);

const audioNodeDisconnectMethodWrapper = injector.get(AudioNodeDisconnectMethodWrapper);
const disconnectingSupportTester = injector.get(DisconnectingSupportTester);
const invalidAccessErrorFactory = injector.get(InvalidAccessErrorFactory);

export class AudioNode extends EventTarget implements IAudioNode {

    protected _nativeNode: null | TNativeAudioNode;

    private _channelCount: number;

    private _channelCountMode: TChannelCountMode;

    private _channelInterpretation: TChannelInterpretation;

    private _context: IMinimalBaseAudioContext;

    private _numberOfInputs: number;

    private _numberOfOutputs: number;

    constructor (
        context: IMinimalBaseAudioContext,
        nativeNode: null | TNativeAudioNode,
        { channelCount, channelCountMode, channelInterpretation, numberOfInputs, numberOfOutputs }: IAudioNodeOptions
    ) {
        super();

        this._channelCount = channelCount;
        this._channelCountMode = channelCountMode;
        this._channelInterpretation = channelInterpretation;
        this._context = context;
        this._nativeNode = nativeNode;
        this._numberOfInputs = numberOfInputs;
        this._numberOfOutputs = numberOfOutputs;

        const nativeContext = getNativeContext(context);

        if (nativeNode !== null) {
            // Bug #12: Firefox and Safari do not support to disconnect a specific destination.
            if (!cacheTestResult(DisconnectingSupportTester, () => disconnectingSupportTester.test(nativeContext))) {
                audioNodeDisconnectMethodWrapper.wrap(nativeNode);
            }

            AUDIO_NODE_STORE.set(this, nativeNode);
        }
    }

    public get channelCount () {
        // Bug #47: The AudioDestinationNode in Edge and Safari do not intialize the maxChannelCount property correctly.
        return (this._nativeNode === null || this._nativeNode === this._nativeNode.context.destination) ?
            this._channelCount :
            this._nativeNode.channelCount;
    }

    public set channelCount (value) {
        // Bug #47: The AudioDestinationNode in Edge and Safari do not intialize the maxChannelCount property correctly.
        if (this._nativeNode === null || this._nativeNode === this._nativeNode.context.destination) {
            this._channelCount = value;
        } else {
            this._nativeNode.channelCount = value;
        }
    }

    public get channelCountMode () {
        return (this._nativeNode === null) ? this._channelCountMode : this._nativeNode.channelCountMode;
    }

    public set channelCountMode (value) {
        if (this._nativeNode === null) {
            this._channelCountMode = value;
        } else {
            this._nativeNode.channelCountMode = value;
        }
    }

    public get channelInterpretation () {
        return (this._nativeNode === null) ? this._channelInterpretation : this._nativeNode.channelInterpretation;
    }

    public set channelInterpretation (value) {
        if (this._nativeNode === null) {
            this._channelInterpretation = value;
        } else {
            this._nativeNode.channelInterpretation = value;
        }
    }

    public get context () {
        return this._context;
    }

    public get numberOfInputs () {
        return (this._nativeNode === null) ? this._numberOfInputs : this._nativeNode.numberOfInputs;
    }

    public get numberOfOutputs () {
        return (this._nativeNode === null) ? this._numberOfOutputs : this._nativeNode.numberOfOutputs;
    }

    public addEventListener (type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        if (this._nativeNode === null) {
            return super.addEventListener(type, listener, options);
        }

        return this._nativeNode.addEventListener(type, listener, options);
    }

    public connect (destination: IAudioNode, output = 0, input = 0): IAudioNode {
        // Bug #41: Only Chrome, Firefox and Opera throw the correct exception by now.
        if (this._context !== destination.context) {
            throw invalidAccessErrorFactory.create();
        }

        const nativeContext = CONTEXT_STORE.get(this._context);

        if (nativeContext === undefined) {
            throw new Error('The native (Offline)AudioContext is missing.');
        }

        if (isOfflineAudioContext(nativeContext)) {
            const faker = <IAudioNodeRenderer> RENDERER_STORE.get(destination);

            if (faker === undefined) {
                throw invalidAccessErrorFactory.create();
            }

            const source = <IAudioNodeRenderer> RENDERER_STORE.get(this);

            if (source === undefined) {
                throw new Error('The associated renderer is missing.');
            }

            faker.wire(source, output, input);

            return destination;
        }

        const nativeDestinationNode = AUDIO_NODE_STORE.get(destination);

        if (this._nativeNode === null || nativeDestinationNode === undefined) {
            throw new Error('The associated nativeNode is missing.');
        }

        this._nativeNode.connect(nativeDestinationNode, output, input);

        // Bug #11: Safari does not support chaining yet. This can be tested with the ChainingSupportTester.
        return destination;
    }

    public disconnect (destination?: IAudioNode): void {
        const nativeContext = CONTEXT_STORE.get(this._context);

        if (nativeContext === undefined) {
            throw new Error('The native (Offline)AudioContext is missing.');
        }

        if (isOfflineAudioContext(nativeContext)) {
            if (destination === undefined) {
                return; // @todo
            }

            const faker = <IAudioNodeRenderer> RENDERER_STORE.get(destination);

            if (faker === undefined) {
                throw new Error('The associated renderer is missing.');
            }

            const source = <IAudioNodeRenderer> RENDERER_STORE.get(this);

            if (source === undefined) {
                throw new Error('The associated renderer is missing.');
            }

            return faker.unwire(source);
        }

        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        if (destination === undefined) {
            return this._nativeNode.disconnect();
        }

        const nativeDestinationNode = AUDIO_NODE_STORE.get(destination);

        if (nativeDestinationNode === undefined) {
            throw new Error('The associated nativeNode is missing.');
        }

        return this._nativeNode.disconnect(nativeDestinationNode);
    }

    public removeEventListener (type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
        if (this._nativeNode === null) {
            return super.removeEventListener(type, listener, options);
        }

        return this._nativeNode.removeEventListener(type, listener, options);
    }

}
