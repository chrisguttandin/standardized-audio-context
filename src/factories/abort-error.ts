import { IErrorFactory } from '../interfaces';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export class AbortErrorFactory implements IErrorFactory {

    public create () {
        try {
            return new DOMException('', 'AbortError');
        } catch (err) {
            const exception: any = new Error();

            exception.code = 20;
            exception.name = 'AbortError';

            return exception;
        }
    }

}

export const ABORT_ERROR_FACTORY_PROVIDER = { deps: [ ], provide: AbortErrorFactory };
