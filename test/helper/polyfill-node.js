import { PolyfillNodeRenderer } from './polyfill-node-renderer';
import { RENDERER_STORE } from '../../src/globals';

export class PolyfillNode {

    constructor (context) {
        const polyfillNodeRenderer = new PolyfillNodeRenderer(this);

        RENDERER_STORE.set(this, polyfillNodeRenderer);

        this._context = context;
    }

    get context () {
        return this._context;
    }

    connect (destination, output = 0, input = 0) {
        const faker = RENDERER_STORE.get(destination);
        const source = RENDERER_STORE.get(this);

        faker.wire(source, output, input);

        return destination;
    }

    disconnect (destination) {
        if (destination === undefined) {
            // @todo
            return;
        }

        const faker = RENDERER_STORE.get(destination);

        if (faker === undefined) {
            throw new Error('The associated renderer is missing.');
        }

        const source = RENDERER_STORE.get(this);

        if (source === undefined) {
            throw new Error('The associated renderer is missing.');
        }

        return faker.unwire(source);
    }

}
