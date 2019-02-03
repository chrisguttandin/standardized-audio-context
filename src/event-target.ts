import { wrapEventListener } from './helpers/wrap-event-listener';
import { TNativeEventTarget } from './types';

export class EventTarget {

    private _listeners: WeakMap<any, null | ((this: this, event: Event) => any)>;

    constructor (private _nativeEventTarget: TNativeEventTarget) {
        this._listeners = new WeakMap();
    }

    public addEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject | null = null,
        options?: boolean | AddEventListenerOptions
    ): void {
        let wrappedEventListener = this._listeners.get(listener);

        if (wrappedEventListener === undefined) {
            wrappedEventListener = wrapEventListener(this, listener);

            if (typeof listener === 'function') {
                this._listeners.set(listener, wrappedEventListener);
            }
        }

        return this._nativeEventTarget.addEventListener(type, wrappedEventListener, options);
    }

    public dispatchEvent (event: Event): boolean {
        return this._nativeEventTarget.dispatchEvent(event);
    }

    public removeEventListener (
        type: string,
        listener: any, // @todo EventListenerOrEventListenerObject | null = null,
        options?: boolean | EventListenerOptions
    ): void {
        const wrappedEventListener = this._listeners.get(listener);

        return this._nativeEventTarget.removeEventListener(
            type,
            (wrappedEventListener === undefined) ? null : wrappedEventListener,
            options
        );
    }

}
