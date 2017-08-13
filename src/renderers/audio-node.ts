import { IAudioNodeRenderer } from '../interfaces';
import { TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';

export class AudioNodeRenderer {

    private _sources: Map<IAudioNodeRenderer, { input: number, output: number }>;

    constructor () {
        this._sources = new Map();
    }

    public unwire (source: IAudioNodeRenderer): void {
        this._sources.delete(source);
    }

    public wire (source: IAudioNodeRenderer, output: number, input: number): void {
        this._sources.set(source, { input, output });
    }

    protected _connectSources (offlineAudioContext: TUnpatchedOfflineAudioContext, nativeNode: TNativeAudioNode) {
        return Promise
            .all(Array
                .from(this._sources)
                .map(([ source, { input, output } ]) => {
                    // For some reason this currently needs to be a function body with a return statement.
                    // The shortcut syntax causes an error.
                    return source
                        .render(offlineAudioContext)
                        .then((node) => node.connect(nativeNode, output, input));
                }));
    }

}
