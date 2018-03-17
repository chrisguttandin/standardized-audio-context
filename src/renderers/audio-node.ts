import { AUDIO_NODE_RENDERER_DESTINATIONS_STORE } from '../globals';
import { IAudioNodeRenderer } from '../interfaces';
import { TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';

export abstract class AudioNodeRenderer implements IAudioNodeRenderer {

    private _sources: Map<IAudioNodeRenderer, { input: number, output: number }>;

    constructor () {
        this._sources = new Map();
    }

    public abstract render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode>;

    public unwire (source: IAudioNodeRenderer): void {
        this._sources.delete(source);

        const renderers = AUDIO_NODE_RENDERER_DESTINATIONS_STORE.get(source);

        if (renderers !== undefined) {
            renderers.delete(this);

            if (renderers.size === 0) {
                AUDIO_NODE_RENDERER_DESTINATIONS_STORE.delete(source);
            }
        }
    }

    public wire (source: IAudioNodeRenderer, output: number, input: number): void {
        this._sources.set(source, { input, output });

        const renderers = AUDIO_NODE_RENDERER_DESTINATIONS_STORE.get(source);

        if (renderers === undefined) {
            AUDIO_NODE_RENDERER_DESTINATIONS_STORE.set(source, new Set([ this ]));
        } else {
            renderers.add(this);
        }
    }

    protected _connectSources (offlineAudioContext: TUnpatchedOfflineAudioContext, nativeNode: TNativeAudioNode) {
        return Promise
            .all(Array
                .from(this._sources)
                .map(([ source, { input, output } ]) => source
                    .render(offlineAudioContext)
                    .then((node) => node.connect(nativeNode, output, input))));
    }

}
