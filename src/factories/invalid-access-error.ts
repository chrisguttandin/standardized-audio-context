import { IErrorFactory } from '../interfaces';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export class InvalidAccessErrorFactory implements IErrorFactory {

    public create () {
        try {
            return new DOMException('', 'InvalidAccessError');
        } catch (err) {
            const exception: any = new Error();

            exception.code = 15;
            exception.name = 'InvalidAccessError';

            return exception;
        }
    }

}

export const INVALID_ACCES_ERROR_FACTORY_PROVIDER = { deps: [ ], provide: InvalidAccessErrorFactory };
