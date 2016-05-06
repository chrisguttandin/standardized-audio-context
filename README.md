# standardized-audio-context

**A patched AudioContext which imitates the current API in current browsers.**

[![tests](https://img.shields.io/travis/chrisguttandin/standardized-audio-context/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/standardized-audio-context)
[![dependencies](https://img.shields.io/david/chrisguttandin/standardized-audio-context.svg?style=flat-square)](https://www.npmjs.com/package/standardized-audio-context)
[![version](https://img.shields.io/npm/v/standardized-audio-context.svg?style=flat-square)](https://www.npmjs.com/package/standardized-audio-context)

This is a hopelessly naive attempt to patch the current implementation of the Web Audio API's
[`AudioContext`](http://webaudio.github.io/web-audio-api/#AudioContext) in current browsers. The
goal is to make them all behave as promised by the
[Specification](http://webaudio.github.io/web-audio-api/).

There are of course some things which cannot be faked in a reasonable way. The most obvious amongst
those is the [`AudioWorkerNode`](http://webaudio.github.io/web-audio-api/#AudioWorker)
which is currently not implemented by any browser. Therefore the corresponding
`createAudioWorker()` method is missing here, too. All implemented methods are covered by unit
tests.

That said, there are a lot of other functions which are currently not implemented for no specific
reason besides a lack of time: `createAudioWorker()`, `createConvolver()`,
`createDelay()`, `createDynamicsCompressor()`, `createMediaElementSource()`,
`createMediaStreamDestination()`, `createMediaStreamSource()`, `createPanner()`,
`createPeriodicWave()`, `createScriptProcessor()`, `createStereoPanner()`, `createWaveShaper()`,
`resume()` and `suspend()`. The `listener` property is also missing for now.

This module also provides an
[`OfflineAudioContext`](http://webaudio.github.io/web-audio-api/#OfflineAudioContext) which does
only expose the `destination`, `length` and `sampleRate` attributes as well as the `createGain()`
and `decodeAudioData()` methods up to now.

## Usage

The `standardized-audio-context` is available on
[npm](https://www.npmjs.com/package/standardized-audio-context) and can be installed as usual.

```shell
npm install standardized-audio-context
```

You can then import the `AudioContext` and `OfflineAudioContext` into your module like this:

```js
import { AudioContext, OfflineAudioContext } from 'standardized-audio-context';
```

In addition to that the `standardized-audio-context` also exports a promise named `isSupported`
which resolves to a boolean which indicates support within the currently used browser.

```js
import { isSupported } from 'standardized-audio-context';

isSupported
    .then((isSupported) => {
        if (isSupported) {
            // yeah everything should work
        } else {
            // oh no this browser seems to be outdated
        }
    });
```

## Tests

Many thanks to [BrowserStack](https://www.browserstack.com) and [Sauce Labs](https://saucelabs.com) for allowing this module to be tested with their services.
