import { TDataCloneErrorFactory } from '../types';

export const createDataCloneError: TDataCloneErrorFactory = () => {
    try {
        return new DOMException('', 'DataCloneError');
    } catch (err) {
        // Bug #122: Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 25;
        err.name = 'DataCloneError';

        return err;
    }
};
