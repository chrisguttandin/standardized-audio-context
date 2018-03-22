function PrototypelessProcessor () { }

PrototypelessProcessor.prototype = null;

registerProcessor('prototypeless-processor', PrototypelessProcessor); // eslint-disable-line no-undef
