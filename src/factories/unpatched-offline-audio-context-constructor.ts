import { TUnpatchedOfflineAudioContextConstructorFactory } from '../types';

export const createUnpatchedOfflineAudioContextConstructor: TUnpatchedOfflineAudioContextConstructorFactory = (window) => {
    if (window === null) {
        return null;
    }

    if (window.hasOwnProperty('OfflineAudioContext')) {
        return (<any> window).OfflineAudioContext;
    }

    return (window.hasOwnProperty('webkitOfflineAudioContext')) ? (<any> window).webkitOfflineAudioContext : null;
};
