# standardized-audio-context

**A patched AudioContext which imitates the current API in current browsers.**

This is a hopelessly naive attempt to patch the current implementation of the Web Audio API's
[`AudioContext`](http://webaudio.github.io/web-audio-api/#the-audiocontext-interface) in current
browsers. The goal is to make them all behave as promised by the
[Specification](http://webaudio.github.io/web-audio-api/).

There are of course some things which cannot be faked in a reasonable way. The most obvious amongst
those is the [`AudioWorkerNode`](http://webaudio.github.io/web-audio-api/#the-audioworker-interface)
which is currently not implemented by any browser. Therefore the corresponding
`createAudioWorker()` method is missing here, too. All implemented methods are covered by unit
tests.

That said, there are a lot of other functions which are currently not implemented for no specific
reason besides a lack of time: `createAnalyser()`, `createAudioWorker()`, `createConvolver()`,
`createDelay()`, `createDynamicsCompressor()`, `createMediaElementSource()`,
`createMediaStreamDestination()`, `createMediaStreamSource()`, `createPanner()`,
`createPeriodicWave()`, `createScriptProcessor()`, `createStereoPanner()`, `createWaveShaper()`,
`resume()` and `suspend()`. The `listener` property is also missing for now.

## Usage

The `standardized-audio-context` is available on
[npm](https://www.npmjs.com/package/standardized-audio-context) and can be installed as usual.

```shell
npm install standardized-audio-context
```

You can then import the `AudioContext` into your module like this:

```js
import { AudioContext } from 'standardized-audio-context';
```

In addition to that the `standardized-audio-context` also exports a flag named `isSupported` to
indicate support from the currently used browser.

```js
import { isSupported } from 'standardized-audio-context';
```
