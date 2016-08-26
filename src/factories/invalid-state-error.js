export class InvalidStateErrorFactory {

    create () { // eslint-disable-line class-methods-use-this
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
