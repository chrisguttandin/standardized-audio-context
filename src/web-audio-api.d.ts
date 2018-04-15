interface ConstantSourceNodeEventMap { // tslint:disable-line:interface-name

    ended: Event;

}

interface ConstantSourceNode extends AudioNode { // tslint:disable-line:interface-name

    readonly offset: AudioParam;

    onended: ((this: ConstantSourceNode, ev: Event) => any) | null;

    addEventListener <K extends keyof ConstantSourceNodeEventMap> (
        type: K,
        listener: (this: OscillatorNode, ev: ConstantSourceNodeEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;

    removeEventListener <K extends keyof ConstantSourceNodeEventMap> (
        type: K,
        listener: (this: OscillatorNode, ev: ConstantSourceNodeEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;

    start (when?: number): void;

    stop (when?: number): void;

}

interface AudioContextBase { // tslint:disable-line:interface-name

    createConstantSource (): ConstantSourceNode;

}

interface AudioParam { // tslint:disable-line:interface-name

    readonly maxValue: number;

    readonly minValue: number;

}

interface MediaElementAudioSourceNode { // tslint:disable-line:interface-name

    readonly mediaElement: HTMLMediaElement;

}

interface MediaStreamAudioSourceNode { // tslint:disable-line:interface-name

    readonly mediaStream: MediaStream;

}

interface Window { // tslint:disable-line:interface-name

    AudioContext: {

        prototype: AudioContext;

        new (): AudioContext;

    };

    OfflineAudioContext: {

        prototype: OfflineAudioContext;

        new (): OfflineAudioContext;

    };

}
