import { Injectable } from '@angular/core';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare var DOMException: {
    new (message: string, name: string): DOMException;
};

@Injectable()
export class EncodingErrorFactory {

    public create () {
        try {
            return new DOMException('', 'EncodingError');
        } catch (err) {
            const exception: any = new Error();

            exception.code = 0;
            exception.name = 'EncodingError';

            return exception;
        }
    }

}
