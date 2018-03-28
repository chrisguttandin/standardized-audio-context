export class EventTarget {

    public addEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject | null = null,
        options?: boolean | AddEventListenerOptions
    ): void {
        // @todo Implement the addEventListener() method.
        listener; // tslint:disable-line:no-unused-expression
        options; // tslint:disable-line:no-unused-expression
        type; // tslint:disable-line:no-unused-expression
    }

    public dispatchEvent (evt: Event): boolean {
        // @todo Implement the dispatchEvent() method.
        evt; // tslint:disable-line:no-unused-expression

        return false;
    }

    public removeEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject | null = null,
        options?: EventListenerOptions | boolean
    ): void {
        // @todo Implement the removeEventListener() method.
        listener; // tslint:disable-line:no-unused-expression
        options; // tslint:disable-line:no-unused-expression
        type; // tslint:disable-line:no-unused-expression
    }

}
