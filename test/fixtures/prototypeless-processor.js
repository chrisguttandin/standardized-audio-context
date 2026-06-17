function PrototypelessProcessor() {}

PrototypelessProcessor.prototype = null;

// eslint-disable-next-line no-undef
registerProcessor('prototypeless-processor', PrototypelessProcessor);
