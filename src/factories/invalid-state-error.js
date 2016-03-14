export class InvalidStateErrorFactory {

    create () {
        var exception;

        try {
            exception = new DOMException('', 'InvalidStateError');
        } catch (err) {
            exception = new Error();

            exception.code = 11;
            exception.name = 'InvalidStateError';
        }

        return exception;
    }

}
