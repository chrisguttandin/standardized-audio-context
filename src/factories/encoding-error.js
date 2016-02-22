export class EncodingErrorFactory {

    create () {
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
