import { IConstructor } from '../interfaces';

const handler = {
    construct (): any {
        return handler;
    }
};

export const isConstructible = (constructible: IConstructor): boolean => {
    try {
        const proxy = new Proxy(constructible, handler);

        new proxy(); // tslint:disable-line:no-unused-expression
    } catch {
        return false;
    }

    return true;
};
