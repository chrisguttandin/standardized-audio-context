export interface IErrorFactory {

    create (): DOMException | Error;

}
