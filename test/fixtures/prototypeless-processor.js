function PrototypelessProcessor() {}

PrototypelessProcessor.prototype = null;

registerProcessor('prototypeless-processor', PrototypelessProcessor);
