export class PromiseSupportTester {

    test (audioContext) {
        // This 12 numbers represent the 48 bytes of an empty WAVE file with a single sample.
        /* eslint-disable indent */
        var uint32Array = new Uint32Array([
                1179011410,
                40,
                1163280727,
                544501094,
                16,
                131073,
                44100,
                176400,
                1048580,
                1635017060,
                4,
                0
            ]);
        /* eslint-enable indent */

        try {
            let promise = audioContext.decodeAudioData(uint32Array.buffer, function () {
                // ignore success callback
            }, function () {
                // ignore error callback
            });

            if (promise === undefined) {
                return false;
            }

            promise.catch(function () {
                // ignore rejected errors
            });

            return true; // eslint-disable-line newline-before-return
        } catch (err) {
            // ignore thrown errors
        }

        return false; // eslint-disable-line newline-before-return
    }

}
