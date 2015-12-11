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
