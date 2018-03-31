import { TInvalidStateErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createInvalidStateError: TInvalidStateErrorFactory = () => {
    try {
        return new DOMException('', 'InvalidStateError');
    } catch (err) {
        const exception: any = new Error();

        exception.code = 11;
        exception.name = 'InvalidStateError';

        return exception;
    }
};
