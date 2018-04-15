interface MessagePortEventMap { // tslint:disable-line:interface-name

    messageerror: MessageEvent;

}

interface MessagePort { // tslint:disable-line:interface-name

    onmessageerror: ((this: MessagePort, ev: MessageEvent) => any) | null;

}
