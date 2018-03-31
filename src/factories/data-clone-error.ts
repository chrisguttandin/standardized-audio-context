import { TDataCloneErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createDataCloneError: TDataCloneErrorFactory = () => {
    try {
        return new DOMException('', 'DataCloneError');
    } catch (err) {
        const exception: any = new Error();

        exception.code = 25;
        exception.name = 'DataCloneError';

        return exception;
    }
};
