// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export class IndexSizeErrorFactory {

    public create () {
        try {
            return new DOMException('', 'IndexSizeError');
        } catch (err) {
            const exception: any = new Error();

            exception.code = 1;
            exception.name = 'IndexSizeError';

            return exception;
        }
    }

}
