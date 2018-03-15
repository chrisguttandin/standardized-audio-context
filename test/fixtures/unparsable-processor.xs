// @todo The filename is .xs instead of .js to prevent eslint from linting this file.

class UnparsableProcessor extends AudioWorkletProcessor {

    some 'unparsable' syntax ()

}

registerProcessor('unparsable-processor', UnparsableProcessor);
