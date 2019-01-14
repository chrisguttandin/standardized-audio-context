import { TInvalidAccessErrorFactory } from '../types';

export const createInvalidAccessError: TInvalidAccessErrorFactory = () => {
    try {
        return new DOMException('', 'InvalidAccessError');
    } catch (err) {
        // Bug #122: Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 15;
        err.name = 'InvalidAccessError';

        return err;
    }
};
