import { Inject, Injectable } from '@angular/core';
import { InvalidAccessErrorFactory } from '../factories/invalid-access-error';

@Injectable()
export class AudioNodeConnectMethodWrapper {

    constructor (@Inject(InvalidAccessErrorFactory) private _invalidAccessErrorFactory) { }

    public wrap (audioNode) {
        audioNode.connect = ((connect, isSupportingChaining, isSupportingConnecting) => {
            if (isSupportingChaining) {
                return (destination, output = 0, input = 0) => {
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
                return (destination, output = 0, input = 0) => {
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
        })(audioNode.connect);
    }

}
