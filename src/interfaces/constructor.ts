export interface IConstructor<T extends any = any> {

    new (...args: any[]): T;

}
