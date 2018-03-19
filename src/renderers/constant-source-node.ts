import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { IAudioParam, IConstantSourceNode, INativeConstantSourceNode } from '../interfaces';
import { TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class ConstantSourceNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | INativeConstantSourceNode;

    private _proxy: IConstantSourceNode;

    constructor (proxy: IConstantSourceNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
    }

    public async render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<INativeConstantSourceNode> {
        if (this._nativeNode !== null) {
            return this._nativeNode;
        }

        this._nativeNode = <INativeConstantSourceNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            const offsetAudioParam = <IAudioParam> (<any> this._nativeNode.offset);

            // @todo TypeScript doesn't know yet about createConstantSource().
            this._nativeNode = <INativeConstantSourceNode> (<any> offlineAudioContext).createConstantSource();

            await renderAutomation(offlineAudioContext, offsetAudioParam, this._nativeNode.offset);
        } else {
            await connectAudioParam(offlineAudioContext, <IAudioParam> (<any> this._nativeNode.offset), this._nativeNode.offset);
        }

        await this._connectSources(offlineAudioContext, <INativeConstantSourceNode> this._nativeNode);

        return <INativeConstantSourceNode> this._nativeNode;
    }

}
