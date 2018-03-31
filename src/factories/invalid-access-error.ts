import { TInvalidAccessErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createInvalidAccessError: TInvalidAccessErrorFactory = () => {
    try {
        return new DOMException('', 'InvalidAccessError');
    } catch (err) {
        const exception: any = new Error();

        exception.code = 15;
        exception.name = 'InvalidAccessError';

        return exception;
    }
};
