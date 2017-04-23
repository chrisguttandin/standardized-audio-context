// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export class EncodingErrorFactory {

    public create () {
        try {
            return new DOMException('', 'EncodingError');
        } catch (err) {
            const exception: any = new Error();

            exception.code = 0;
            exception.name = 'EncodingError';

            return exception;
        }
    }

}
