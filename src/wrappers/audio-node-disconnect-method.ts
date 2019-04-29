import { isNativeAudioNode } from '../guards/native-audio-node';
import { TNativeAudioNode, TNativeAudioParam } from '../types';

export const wrapAudioNodeDisconnectMethod = (nativeAudioNode: TNativeAudioNode): void => {
    const connections = new Map<TNativeAudioNode | TNativeAudioParam, { input: number; output: number }[]>();

    nativeAudioNode.connect = <TNativeAudioNode['connect']> ((connect) => {
        return (destination: TNativeAudioNode | TNativeAudioParam, output = 0, input = 0): void | TNativeAudioNode => {
            const returnValue = (isNativeAudioNode(destination))
                ? connect(destination, output, input)
                : connect(destination, output);

            // Save the new connection only if the calls to connect above didn't throw an error.
            const connectionsToDestination = connections.get(destination);

            if (connectionsToDestination === undefined) {
                connections.set(destination, [ { input, output } ]);
            } else {
                if (connectionsToDestination.every((connection) => (connection.input !== input || connection.output !== output))) {
                    connectionsToDestination.push({ input, output });
                }
            }

            return returnValue;
        };
    })(nativeAudioNode.connect.bind(nativeAudioNode));

    nativeAudioNode.disconnect = ((disconnect) => {
        return (outputOrDestination?: number | TNativeAudioNode | TNativeAudioParam, output?: number, input?: number): void => {
            disconnect.apply(nativeAudioNode);

            if (outputOrDestination === undefined) {
                connections.clear();
            } else if (typeof outputOrDestination === 'number') {
                for (const [ destination, connectionsToDestination ] of connections) {
                    const filteredConnections = connectionsToDestination
                        .filter((connection) => (connection.output !== outputOrDestination));

                    if (filteredConnections.length === 0) {
                        connections.delete(destination);
                    } else {
                        connections.set(destination, filteredConnections);
                    }
                }
            } else if (connections.has(outputOrDestination)) {
                if (output === undefined) {
                    connections.delete(outputOrDestination);
                } else {
                    const connectionsToDestination = connections.get(outputOrDestination);

                    if (connectionsToDestination !== undefined) {
                        const filteredConnections = connectionsToDestination
                            .filter((connection) => (connection.output !== output && (connection.input !== input || input === undefined)));

                        if (filteredConnections.length === 0) {
                            connections.delete(outputOrDestination);
                        } else {
                            connections.set(outputOrDestination, filteredConnections);
                        }
                    }
                }
            }

            for (const [ destination, connectionsToDestination ] of connections) {
                connectionsToDestination
                    .forEach((connection) => {
                        if (isNativeAudioNode(destination)) {
                            nativeAudioNode.connect(destination, connection.output, connection.input);
                        } else {
                            nativeAudioNode.connect(destination, connection.output);
                        }
                    });
            }
        };
    })(nativeAudioNode.disconnect);
};
