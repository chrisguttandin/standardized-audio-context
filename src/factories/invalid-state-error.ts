import { TInvalidStateErrorFactory } from '../types';

export const createInvalidStateError: TInvalidStateErrorFactory = () => {
    try {
        return new DOMException('', 'InvalidStateError');
    } catch (err) {
        // Bug #122: Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 11;
        err.name = 'InvalidStateError';

        return err;
    }
};
