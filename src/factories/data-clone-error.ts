import { TDataCloneErrorFactory } from '../types';

export const createDataCloneError: TDataCloneErrorFactory = () => {
    try {
        return new DOMException('', 'DataCloneError');
    } catch (err) {
        err.code = 25;
        err.name = 'DataCloneError';

        return err;
    }
};
