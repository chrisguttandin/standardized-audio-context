import 'reflect-metadata';
import { AudioBufferSourceNodeStopMethodWrapper } from './wrapper/audio-buffer-source-node-stop-method';
import { AudioBufferWrapper } from './wrapper/audio-buffer';
import { AudioNodeConnectMethodWrapper } from './wrapper/audio-node-connect-method';
import { AudioNodeDisconnectMethodWrapper } from './wrapper/audio-node-disconnect-method';
import { ChainingSupportTester } from './tester/chaining-support';
import { ChannelMergerNodeWrapper } from './wrapper/channel-merger-node';
import { ChannelSplitterNodeWrapper } from './wrapper/channel-splitter-node';
import { DecodeAudioDataTypeErrorSupportTester } from './tester/decode-audio-data-type-error-support';
import { DisconnectingSupportTester } from './tester/disconnecting-support';
import { EncodingErrorFactory } from './factories/encoding-error';
import { IIRFilterNodeFaker } from './fakers/iir-filter-node';
import { IIRFilterNodeGetFrequencyResponseMethodWrapper } from './wrapper/iir-filter-node-get-frequency-response-method';
import { InvalidStateErrorFactory } from './factories/invalid-state-error';
import { MergingSupportTester } from './tester/merging-support';
import { NotSupportedErrorFactory } from './factories/not-supported-error';
import { OfflineAudioBufferSourceNodeFakerFactory } from './factories/offline-audio-buffer-source-node';
import { OfflineAudioDestinationNodeFakerFactory } from './factories/offline-audio-destination-node';
import { OfflineBiquadFilterNodeFakerFactory } from './factories/offline-biquad-filter-node';
import { OfflineGainNodeFakerFactory } from './factories/offline-gain-node';
import { OfflineIIRFilterNodeFakerFactory } from './factories/offline-iir-filter-node';
import { PromiseSupportTester } from './tester/promise-support';
import { ReflectiveInjector } from '@angular/core';
import { StopStoppedSupportTester } from './tester/stop-stopped-support';
import { audioContextConstructor } from './audio-context-constructor';
import { isSupportedPromise } from './is-supported-promise';
import { modernizr } from './modernizr';
import { offlineAudioContextConstructor } from './offline-audio-context-constructor';
import { unpatchedAudioContextConstructor } from './unpatched-audio-context-constructor';
import { unpatchedOfflineAudioContextConstructor } from './unpatched-offline-audio-context-constructor';
import { window } from './window';

/* eslint-disable indent, new-cap */
var injector = ReflectiveInjector.resolveAndCreate([
        AudioBufferSourceNodeStopMethodWrapper,
        AudioBufferWrapper,
        AudioNodeConnectMethodWrapper,
        AudioNodeDisconnectMethodWrapper,
        ChainingSupportTester,
        ChannelMergerNodeWrapper,
        ChannelSplitterNodeWrapper,
        DecodeAudioDataTypeErrorSupportTester,
        DisconnectingSupportTester,
        EncodingErrorFactory,
        IIRFilterNodeFaker,
        IIRFilterNodeGetFrequencyResponseMethodWrapper,
        InvalidStateErrorFactory,
        MergingSupportTester,
        NotSupportedErrorFactory,
        OfflineAudioBufferSourceNodeFakerFactory,
        OfflineAudioDestinationNodeFakerFactory,
        OfflineBiquadFilterNodeFakerFactory,
        OfflineGainNodeFakerFactory,
        OfflineIIRFilterNodeFakerFactory,
        PromiseSupportTester,
        StopStoppedSupportTester,
        { provide: audioContextConstructor, useFactory: audioContextConstructor },
        { provide: isSupportedPromise, useFactory: isSupportedPromise },
        { provide: modernizr, useValue: modernizr },
        { provide: offlineAudioContextConstructor, useFactory: offlineAudioContextConstructor },
        { provide: unpatchedAudioContextConstructor, useFactory: unpatchedAudioContextConstructor },
        { provide: unpatchedOfflineAudioContextConstructor, useFactory: unpatchedOfflineAudioContextConstructor },
        { provide: window, useValue: window }
    ]);
/* eslint-enable indent, new-cap */

export const AudioContext = injector.get(audioContextConstructor);

export const isSupported = injector.get(isSupportedPromise);

export const OfflineAudioContext = injector.get(offlineAudioContextConstructor);
