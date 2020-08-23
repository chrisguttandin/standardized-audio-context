import { MOST_NEGATIVE_SINGLE_FLOAT, MOST_POSITIVE_SINGLE_FLOAT } from '../constants';
import { IAudioParam } from '../interfaces';
import { TAudioListenerFactoryFactory } from '../types';

export const createAudioListenerFactory: TAudioListenerFactoryFactory = (
    createAudioParam,
    createNativeChannelMergerNode,
    createNativeConstantSourceNode,
    createNativeScriptProcessorNode,
    isNativeOfflineAudioContext
) => {
    return (context, nativeContext) => {
        const nativeListener = nativeContext.listener;

        // Bug #117: Only Chrome, Edge & Opera support the new interface already.
        const createFakeAudioParams = () => {
            const channelMergerNode = createNativeChannelMergerNode(nativeContext, {
                channelCount: 1,
                channelCountMode: 'explicit',
                channelInterpretation: 'speakers',
                numberOfInputs: 9
            });
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const scriptProcessorNode = createNativeScriptProcessorNode(nativeContext, 256, 9, 0);

            const createFakeAudioParam = (input: number, value: number) => {
                const constantSourceNode = createNativeConstantSourceNode(nativeContext, {
                    channelCount: 1,
                    channelCountMode: 'explicit',
                    channelInterpretation: 'discrete',
                    offset: value
                });

                constantSourceNode.connect(channelMergerNode, 0, input);

                // @todo This should be stopped when the context is closed.
                constantSourceNode.start();

                Object.defineProperty(constantSourceNode.offset, 'defaultValue', {
                    get(): number {
                        return value;
                    }
                });

                /*
                 * Bug #62 & #74: Safari does not support ConstantSourceNodes and does not export the correct values for maxValue and
                 * minValue for GainNodes.
                 */
                return createAudioParam(
                    <any>{ context },
                    isOffline,
                    constantSourceNode.offset,
                    MOST_POSITIVE_SINGLE_FLOAT,
                    MOST_NEGATIVE_SINGLE_FLOAT
                );
            };

            let lastOrientation = [0, 0, -1, 0, 1, 0];
            let lastPosition = [0, 0, 0];

            // tslint:disable-next-line:deprecation
            scriptProcessorNode.onaudioprocess = ({ inputBuffer }) => {
                const orientation: [number, number, number, number, number, number] = [
                    inputBuffer.getChannelData(0)[0],
                    inputBuffer.getChannelData(1)[0],
                    inputBuffer.getChannelData(2)[0],
                    inputBuffer.getChannelData(3)[0],
                    inputBuffer.getChannelData(4)[0],
                    inputBuffer.getChannelData(5)[0]
                ];

                if (orientation.some((value, index) => value !== lastOrientation[index])) {
                    nativeListener.setOrientation(...orientation); // tslint:disable-line:deprecation

                    lastOrientation = orientation;
                }

                const positon: [number, number, number] = [
                    inputBuffer.getChannelData(6)[0],
                    inputBuffer.getChannelData(7)[0],
                    inputBuffer.getChannelData(8)[0]
                ];

                if (positon.some((value, index) => value !== lastPosition[index])) {
                    nativeListener.setPosition(...positon); // tslint:disable-line:deprecation

                    lastPosition = positon;
                }
            };
            channelMergerNode.connect(scriptProcessorNode);

            return {
                forwardX: createFakeAudioParam(0, 0),
                forwardY: createFakeAudioParam(1, 0),
                forwardZ: createFakeAudioParam(2, -1),
                positionX: createFakeAudioParam(6, 0),
                positionY: createFakeAudioParam(7, 0),
                positionZ: createFakeAudioParam(8, 0),
                upX: createFakeAudioParam(3, 0),
                upY: createFakeAudioParam(4, 1),
                upZ: createFakeAudioParam(5, 0)
            };
        };

        const { forwardX, forwardY, forwardZ, positionX, positionY, positionZ, upX, upY, upZ } =
            nativeListener.forwardX === undefined ? createFakeAudioParams() : nativeListener;

        return {
            get forwardX(): IAudioParam {
                return forwardX;
            },
            get forwardY(): IAudioParam {
                return forwardY;
            },
            get forwardZ(): IAudioParam {
                return forwardZ;
            },
            get positionX(): IAudioParam {
                return positionX;
            },
            get positionY(): IAudioParam {
                return positionY;
            },
            get positionZ(): IAudioParam {
                return positionZ;
            },
            get upX(): IAudioParam {
                return upX;
            },
            get upY(): IAudioParam {
                return upY;
            },
            get upZ(): IAudioParam {
                return upZ;
            }
        };
    };
};
