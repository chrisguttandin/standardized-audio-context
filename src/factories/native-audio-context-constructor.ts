import { TNativeAudioContextConstructorFactory } from '../types';

export const createNativeAudioContextConstructor: TNativeAudioContextConstructorFactory = (window) => {
    if (window === null) {
        return null;
    }

    if (window.hasOwnProperty('AudioContext')) {
        return (<any> window).AudioContext;
    }

    return (window.hasOwnProperty('webkitAudioContext')) ? (<any> window).webkitAudioContext : null;
};
