import { IConstructor } from '../interfaces';

const handler = {
    construct () {
        return handler;
    }
};

export const isConstructible = (constructible: IConstructor): boolean => {
    try {
        const proxy = new Proxy(constructible, handler);

        new proxy(); // tslint:disable-line:no-unused-expression
    } catch (err) {
        return false;
    }

    return true;
};
