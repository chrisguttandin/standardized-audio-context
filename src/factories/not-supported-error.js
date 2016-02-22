export class NotSupportedErrorFactory {

    create () {
        var exception;

        try {
            exception = new DOMException('', 'NotSupportedError');
        } catch (err) {
            exception = new Error();

            exception.code = 9;
            exception.name = 'NotSupportedError';
        }

        return exception;
    }

}
