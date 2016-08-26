export class NotSupportedErrorFactory {

    create () { // eslint-disable-line class-methods-use-this
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
