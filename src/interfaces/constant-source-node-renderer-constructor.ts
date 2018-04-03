import { IConstantSourceNode } from './constant-source-node';
import { IConstantSourceNodeRenderer } from './constant-source-node-renderer';

export interface IConstantSourceNodeRendererConstructor {

    new (proxy: IConstantSourceNode): IConstantSourceNodeRenderer;

}
