export const wrapEventListener = <T>(
    target: T,
    eventListener: null | ((this: T, event: Event) => any)
): null | ((this: T, event: Event) => any) => {
    if (typeof eventListener === 'function') {
        return (event) => {
            const descriptor = { value: target };

            Object.defineProperties(event, {
                currentTarget: descriptor,
                target: descriptor
            });

            return eventListener.call(target, event);
        };
    }

    return eventListener;
};
