import { Injectable } from '@angular/core';
import { InvalidAccessErrorFactory } from '../factories/invalid-access-error';
import { IAudioNode } from '../interfaces';

@Injectable()
export class AudioNodeConnectMethodWrapper {

    constructor (private _invalidAccessErrorFactory: InvalidAccessErrorFactory) { }

    public wrap (audioNode: IAudioNode, isSupportingChaining: boolean) {
        audioNode.connect = ((connect, sSpprtngChnng: boolean) => {
            if (sSpprtngChnng) {
                return (destination: IAudioNode, output = 0, input = 0) => {
                    try {
                        return connect.call(audioNode, destination, output, input);
                    } catch (err) {
                        if (err.code === 12) {
                            throw this._invalidAccessErrorFactory.create();
                        }

                        throw err;
                    }
                };
            } else {
                return (destination: IAudioNode, output = 0, input = 0) => {
                    try {
                        connect.call(audioNode, destination, output, input);
                    } catch (err) {
                        if (err.code === 12) {
                            throw this._invalidAccessErrorFactory.create();
                        }

                        throw err;
                    }

                    return destination;
                };
            }
        })(audioNode.connect, isSupportingChaining);
    }

}
