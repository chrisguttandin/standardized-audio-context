import { TInvalidStateErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createInvalidStateError: TInvalidStateErrorFactory = () => {
    try {
        return new DOMException('', 'InvalidStateError');
    } catch (err) {
        err.code = 11;
        err.name = 'InvalidStateError';

        return err;
    }
};
