import { IErrorFactory } from '../interfaces';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export class DataCloneErrorFactory implements IErrorFactory {

    public create () {
        try {
            return new DOMException('', 'DataCloneError');
        } catch (err) {
            const exception: any = new Error();

            exception.code = 25;
            exception.name = 'DataCloneError';

            return exception;
        }
    }

}

export const DATA_CLONE_ERROR_FACTORY_PROVIDER = { deps: [ ], provide: DataCloneErrorFactory };
