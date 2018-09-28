import { TDataCloneErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createDataCloneError: TDataCloneErrorFactory = () => {
    try {
        return new DOMException('', 'DataCloneError');
    } catch (err) {
        err.code = 25;
        err.name = 'DataCloneError';

        return err;
    }
};
