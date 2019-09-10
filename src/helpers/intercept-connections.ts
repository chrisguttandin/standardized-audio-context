import { isNativeAudioNode } from '../guards/native-audio-node';
import { TNativeAudioNode, TNativeAudioParam } from '../types';

export const interceptConnections = <T extends object> (
    original: T,
    interceptor: TNativeAudioNode
): T & { connect: TNativeAudioNode['connect']; disconnect: TNativeAudioNode['disconnect'] } => {
    function connect (destinationNode: TNativeAudioNode, output?: number, input?: number): TNativeAudioNode;
    function connect (destinationParam: TNativeAudioParam, output?: number): void;
    function connect (destination: TNativeAudioNode | TNativeAudioParam, output = 0, input = 0): void | TNativeAudioNode { // tslint:disable-line:invalid-void max-line-length
        if (isNativeAudioNode(destination)) {
            interceptor.connect(destination, output, input);

            // Bug #11: Safari does not support chaining yet.
            return destination;
        }

        return interceptor.connect(destination, output);
    }

    (<T & { connect: TNativeAudioNode['connect'] }> original).connect = connect;

    (<T & { disconnect: TNativeAudioNode['disconnect'] }> original).disconnect = interceptor.disconnect.bind(interceptor);

    return <T & { connect: TNativeAudioNode['connect']; disconnect: TNativeAudioNode['disconnect'] }> original;
};
