# standardized-audio-context

**A cross-browser implementation of the AudioContext which aims to closely follow the standard.**

[![tests](https://img.shields.io/travis/chrisguttandin/standardized-audio-context/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/standardized-audio-context)
[![dependencies](https://img.shields.io/david/chrisguttandin/standardized-audio-context.svg?style=flat-square)](https://www.npmjs.com/package/standardized-audio-context)
[![version](https://img.shields.io/npm/v/standardized-audio-context.svg?style=flat-square)](https://www.npmjs.com/package/standardized-audio-context)

This package provides a subset of the [Web Audio API](https://webaudio.github.io/web-audio-api) which works in a reliable and consistent way in every supported browser. In contrast to other popular polyfills `standardized-audio-context` does not patch or modify anything on the global scope. In other words, it does not cause any side effects. It can therefore be used safely inside of libraries.

One of the goals of `standardized-audio-context` is to only polyfill missing functionality and to avoid rewriting builtin features whenever possible.

There are of course some things which cannot be faked in a way that makes them as performant as
they could be when implemented natively. The most obvious amongst those things is the
[`AudioWorklet`](https://webaudio.github.io/web-audio-api/#audioworklet). Please have a look at the [list of all supported methods](https://github.com/chrisguttandin/standardized-audio-context#api) below for more detailed information.

## Usage

The `standardized-audio-context` is available on
[npm](https://www.npmjs.com/package/standardized-audio-context) and can be installed as usual.

```shell
npm install standardized-audio-context
```

You can then import the `AudioContext` and `OfflineAudioContext` like this:

```js
import { AudioContext, OfflineAudioContext } from 'standardized-audio-context';
```

Afterwards the `AudioContext`/`OfflineAudioContext` can be used in the same way as their native counterparts. The following snippet will produce a nice and clean sine wave.

```js
import { AudioContext } from 'standardized-audio-context';

const audioContext = new AudioContext();
const oscillatorNode = audioContext.createOscillator();

oscillatorNode.connect(audioContext.destination);

oscillatorNode.start();
```

An alternative approach would be to use the AudioNode constructors (the OscillatorNode constructor in this case) instead of the factory methods.

```js
import { AudioContext, OscillatorNode } from 'standardized-audio-context';

const audioContext = new AudioContext();
const oscillatorNode = new OscillatorNode(audioContext);

oscillatorNode.connect(audioContext.destination);

oscillatorNode.start();
```

## API

### AudioContext

This is an incomplete implementation of the [`AudioContext`](https://webaudio.github.io/web-audio-api/#audiocontext) interface. It misses the following factory methods: `createConvolver()`, `createDelay()`, `createDynamicsCompressor()`, `createMediaStreamDestination()`, `createPanner()`, `createPeriodicWave()`, `createScriptProcessor()`, `createStereoPanner()` and `createWaveShaper()`. The `listener` property is also missing for now.

With the exception of `createMediaStreamDestination()` and `createScriptProcessor()` there is no technical reason for not supporting these methods. They are just not implemented yet. Please create a [new issue](https://github.com/chrisguttandin/standardized-audio-context/issues/new) if you desperately need any of them.

### OfflineAudioContext

This is an incomplete implementation of the [`OfflineAudioContext`](https://webaudio.github.io/web-audio-api/#offlineaudiocontext) interface. It misses mostly the same methods as the AudioContext which are: `createConvolver()`, `createDelay()`, `createDynamicsCompressor()`, `createPanner()`, `createPeriodicWave()`, `createScriptProcessor()`, `createStereoPanner()` and `createWaveShaper()`.

### audioWorklet

The [`AudioWorklet`](https://webaudio.github.io/web-audio-api/#audioworklet) is accessible as a property of an AudioContext or OfflineAudioContext. It uses the ScriptProcessorNode internally to create an [`AudioWorkletProcessor`](https://webaudio.github.io/web-audio-api/#audioworkletprocessor) in any browser but Chrome. This means it will not provide the performance improvements that you would normally expect from using an [`AudioWorklet`](https://webaudio.github.io/web-audio-api/#audioworkletnode).

The fact that the internal implementation relies on a ScriptProcessorNode also implies that the [`channelCountMode`](https://webaudio.github.io/web-audio-api/#dom-audionode-channelcountmode) can only be `'explicit'` for now. It also means that the total number of channels of all inputs plus the number of all parameters can't be larger than six.

Another thing to keep in mind is that the fallback will evaluate the `AudioWorkletProcessor` on the global scope. It gets isolated in basic way to mimic the [`AudioWorkletGlobalScope`](https://webaudio.github.io/web-audio-api/#audioworkletglobalscope) but that can't be done in a way which makes it impossible for an attacker to break out of that sandbox. This should not be a problem unless you load an AudioWorklet from an untrusted source.

### decodeAudioData()

This is an implementation of the
[`decodeAudioData()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-decodeaudiodata) method.

### AnalyserNode / createAnalyser()

This is an implementation of the
[`AnalyserNode`](https://webaudio.github.io/web-audio-api/#analysernode) constructor and the [`createAnalyser()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createanalyser) factory method respectively.

### AudioBuffer / createBuffer()

This is an implementation of the
[`AudioBuffer`](https://webaudio.github.io/web-audio-api/#audiobuffer) constructor and the [`createBuffer()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createbuffer) factory method respectively.

### AudioBufferSourceNode / createBufferSource()

This is an implementation of the
[`AudioBufferSourceNode`](https://webaudio.github.io/web-audio-api/#AudioBufferSourceNode) constructor and the [`createBufferSource()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createbuffersource) factory method respectively. It is currently missing the [detune AudioParam](https://webaudio.github.io/web-audio-api/#dom-audiobuffersourcenode-detune).

### BiquadFilterNode / createBiquadFilter()

This is an implementation of the
[`BiquadFilterNode`](https://webaudio.github.io/web-audio-api/#biquadfilternode) constructor and the [`createBiquadFilter()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createbiquadfilter) factory method respectively.

### ChannelMergerNode / createChannelMerger()

This is an implementation of the
[`ChannelMergerNode`](https://webaudio.github.io/web-audio-api/#channelmergernode) constructor and the [`createChannelMerger()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createchannelmerger) factory method respectively.

### ChannelSplitterNode / createChannelSplitter()

This is an implementation of the
[`ChannelSplitterNode`](https://webaudio.github.io/web-audio-api/#channelsplitternode) constructor and the [`createChannelSplitter()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createchannelsplitter) factory method respectively.

### ConstantSourceNode / createConstantSource()

This is an implementation of the
[`ConstantSourceNode`](https://webaudio.github.io/web-audio-api/#ConstantSourceNode) constructor and the [`createConstantSource()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createconstantsource) factory method respectively.

### GainNode / createGain()

This is an implementation of the
[`GainNode`](https://webaudio.github.io/web-audio-api/#gainnode) constructor and the [`createGain()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-creategain) factory method respectively.

### IIRFilterNode / createIIRFilter()

This is an implementation of the
[`IIRFilterNode`](https://webaudio.github.io/web-audio-api/#iirfilternode) constructor and the [`createIIRFilter()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createiirfilter) factory method respectively. It has to be faked internally with a ScriptProcessorNode in Safari which means it is not as performant as in other browsers which support it natively.

### OscillatorNode / createOscillator()

This is an implementation of the
[`OscillatorNode`](https://webaudio.github.io/web-audio-api/#oscillatornode) constructor and the [`createOscillator()`](https://webaudio.github.io/web-audio-api/#dom-baseaudiocontext-createoscillator) factory method respectively.

### isSupported()

 `standardized-audio-context` is also exporting a promise which can be accessed by calling `isSupported()`. This promise resolves to a boolean which indicates if the functionality is supported within the currently used browser. This is not part of the specification.

```js
import { isSupported } from 'standardized-audio-context';

isSupported()
    .then((isSupported) => {
        if (isSupported) {
            // yeah everything should work
        } else {
            // oh no this browser seems to be outdated
        }
    });
```

## TypeScript

This package is written in [TypeScript](https://www.typescriptlang.org/) which means it can be used seamlessly in any TypeScript project. But that is entirely optional.

In contrast to the Web Audio API types that TypeScript provides out of the box the types exported
by  `standardized-audio-context` do actually match the concrete implementation. TypeScript
generates its types from the [Web IDL](https://heycam.github.io/webidl) definition of the Web Audio
API which does not always match the actually available implementations.

## Tests

All implemented methods are covered by a large number of tests which are executed on a variety of browsers. Many thanks to [BrowserStack](https://www.browserstack.com) and [Sauce Labs](https://saucelabs.com) for allowing this module to be tested with their services.
