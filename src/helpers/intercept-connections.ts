import { TNativeAudioNode, TNativeAudioParam } from '../types';

export const interceptConnections = <T extends Object> (
    original: T,
    interceptor: TNativeAudioNode
): T & { connect: TNativeAudioNode['connect']; disconnect: TNativeAudioNode['disconnect'] } => {
    (<T & { connect: TNativeAudioNode['connect'] }> original).connect = ((
        destination: TNativeAudioNode | TNativeAudioParam,
        output = 0,
        input = 0
    ) => {
        if (destination instanceof AudioNode) {
            // @todo TypeScript cannot infer the overloaded signature with 3 arguments yet.
            (<any> interceptor.connect).call(interceptor, destination, output, input);

            // Bug #11: Safari does not support chaining yet.
            return destination;
        }

        // @todo TypeScript does still assume that connect() returns void.
        return <TNativeAudioNode> (<any> interceptor.connect.call(interceptor, destination, output));
    });

    (<T & { disconnect: TNativeAudioNode['disconnect'] }> original).disconnect = function (): void {
        // @todo TypeScript cannot infer all the signatures yet.
        (<any> interceptor.disconnect).apply(interceptor, arguments);
    };

    return <T & { connect: TNativeAudioNode['connect']; disconnect: TNativeAudioNode['disconnect'] }> original;
};
