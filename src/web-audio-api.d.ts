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
