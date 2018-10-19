import { TNativeAudioNode, TNativeAudioParam } from '../types';

export const interceptConnections = <T extends Object> (
    original: T,
    interceptor: TNativeAudioNode
): T & { connect: TNativeAudioNode['connect'], disconnect: TNativeAudioNode['disconnect'] } => {
    (<T & { connect: TNativeAudioNode['connect'] }> original).connect = ((
        destination: TNativeAudioNode | TNativeAudioParam,
        output = 0,
        input = 0
    ) => {
        if (destination instanceof AudioNode) {
            interceptor.connect.call(interceptor, destination, output, input);

            // Bug #11: Safari does not support chaining yet.
            return destination;
        }

        // @todo This return statement is necessary to satisfy TypeScript.
        return interceptor.connect.call(interceptor, destination, output);
    });

    (<T & { disconnect: TNativeAudioNode['disconnect'] }> original).disconnect = function () {
        interceptor.disconnect.apply(interceptor, arguments);
    };

    return <T & { connect: TNativeAudioNode['connect'], disconnect: TNativeAudioNode['disconnect'] }> original;
};
