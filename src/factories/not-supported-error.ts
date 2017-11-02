import { IErrorFactory } from '../interfaces';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export class NotSupportedErrorFactory implements IErrorFactory {

    public create () {
        try {
            return new DOMException('', 'NotSupportedError');
        } catch (err) {
            const exception: any = new Error();

            exception.code = 9;
            exception.name = 'NotSupportedError';

            return exception;
        }
    }

}

export const NOT_SUPPORTED_ERROR_FACTORY_PROVIDER = { deps: [ ], provide: NotSupportedErrorFactory };
