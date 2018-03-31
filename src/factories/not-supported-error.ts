import { TNotSupportedErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createNotSupportedError: TNotSupportedErrorFactory = () => {
    try {
        return new DOMException('', 'NotSupportedError');
    } catch (err) {
        const exception: any = new Error();

        exception.code = 9;
        exception.name = 'NotSupportedError';

        return exception;
    }
};
