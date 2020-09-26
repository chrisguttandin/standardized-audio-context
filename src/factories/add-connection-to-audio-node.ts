import { addActiveInputConnectionToAudioNode } from '../helpers/add-active-input-connection-to-audio-node';
import { addPassiveInputConnectionToAudioNode } from '../helpers/add-passive-input-connection-to-audio-node';
import { connectNativeAudioNodeToNativeAudioNode } from '../helpers/connect-native-audio-node-to-native-audio-node';
import { deleteActiveInputConnectionToAudioNode } from '../helpers/delete-active-input-connection-to-audio-node';
import { deletePassiveInputConnectionToAudioNode } from '../helpers/delete-passive-input-connection-to-audio-node';
import { disconnectNativeAudioNodeFromNativeAudioNode } from '../helpers/disconnect-native-audio-node-from-native-audio-node';
import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { getEventListenersOfAudioNode } from '../helpers/get-event-listeners-of-audio-node';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { insertElementInSet } from '../helpers/insert-element-in-set';
import { isActiveAudioNode } from '../helpers/is-active-audio-node';
import { isPartOfACycle } from '../helpers/is-part-of-a-cycle';
import { isPassiveAudioNode } from '../helpers/is-passive-audio-node';
import { setInternalStateToActive } from '../helpers/set-internal-state-to-active';
import { setInternalStateToPassiveWhenNecessary } from '../helpers/set-internal-state-to-passive-when-necessary';
import { TAddConnectionToAudioNodeFactory, TInternalStateEventListener } from '../types';

export const createAddConnectionToAudioNode: TAddConnectionToAudioNodeFactory = (getAudioNodeTailTime) => {
    return (source, destination, output, input, isOffline) => {
        const { activeInputs, passiveInputs } = getAudioNodeConnections(destination);
        const { outputs } = getAudioNodeConnections(source);
        const eventListeners = getEventListenersOfAudioNode(source);

        const eventListener: TInternalStateEventListener = (isActive) => {
            const nativeDestinationAudioNode = getNativeAudioNode(destination);
            const nativeSourceAudioNode = getNativeAudioNode(source);

            if (isActive) {
                const partialConnection = deletePassiveInputConnectionToAudioNode(passiveInputs, source, output, input);

                addActiveInputConnectionToAudioNode(activeInputs, source, partialConnection, false);

                if (!isOffline && !isPartOfACycle(source)) {
                    connectNativeAudioNodeToNativeAudioNode(nativeSourceAudioNode, nativeDestinationAudioNode, output, input);
                }

                if (isPassiveAudioNode(destination)) {
                    setInternalStateToActive(destination);
                }
            } else {
                const partialConnection = deleteActiveInputConnectionToAudioNode(activeInputs, source, output, input);

                addPassiveInputConnectionToAudioNode(passiveInputs, input, partialConnection, false);

                if (!isOffline && !isPartOfACycle(source)) {
                    disconnectNativeAudioNodeFromNativeAudioNode(nativeSourceAudioNode, nativeDestinationAudioNode, output, input);
                }

                const tailTime = getAudioNodeTailTime(destination);

                if (tailTime === 0) {
                    if (isActiveAudioNode(destination)) {
                        setInternalStateToPassiveWhenNecessary(destination, activeInputs);
                    }
                } else {
                    setTimeout(() => {
                        if (isActiveAudioNode(destination)) {
                            setInternalStateToPassiveWhenNecessary(destination, activeInputs);
                        }
                    }, tailTime * 1000);
                }
            }
        };

        if (
            insertElementInSet(
                outputs,
                [destination, output, input],
                (outputConnection) =>
                    outputConnection[0] === destination && outputConnection[1] === output && outputConnection[2] === input,
                true
            )
        ) {
            eventListeners.add(eventListener);

            if (isActiveAudioNode(source)) {
                addActiveInputConnectionToAudioNode(activeInputs, source, [output, input, eventListener], true);
            } else {
                addPassiveInputConnectionToAudioNode(passiveInputs, input, [source, output, eventListener], true);
            }

            return true;
        }

        return false;
    };
};
