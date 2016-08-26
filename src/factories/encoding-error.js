export class EncodingErrorFactory {

    create () { // eslint-disable-line class-methods-use-this
        var exception;

        try {
            exception = new DOMException('', 'EncodingError');
        } catch (err) {
            exception = new Error();

            exception.code = 0;
            exception.name = 'EncodingError';
        }

        return exception;
    }

}
