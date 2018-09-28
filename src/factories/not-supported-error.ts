import { TNotSupportedErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createNotSupportedError: TNotSupportedErrorFactory = () => {
    try {
        return new DOMException('', 'NotSupportedError');
    } catch (err) {
        err.code = 9;
        err.name = 'NotSupportedError';

        return err;
    }
};
