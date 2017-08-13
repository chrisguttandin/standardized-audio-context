export class EventTarget {

    public addEventListener (type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        // @todo Implement the addEventListener() method.
        listener; // tslint:disable-line:no-unused-expression
        options; // tslint:disable-line:no-unused-expression
        type; // tslint:disable-line:no-unused-expression
    }

    public dispatchEvent (evt: Event) {
        // @todo Implement the dispatchEvent() method.
        evt; // tslint:disable-line:no-unused-expression

        return false;
    }

    public removeEventListener (type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
        // @todo Implement the removeEventListener() method.
        listener; // tslint:disable-line:no-unused-expression
        options; // tslint:disable-line:no-unused-expression
        type; // tslint:disable-line:no-unused-expression
    }

}
