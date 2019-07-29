export const wrapEventListener = <T, U extends Event>(
    target: T,
    eventListener: null | ((this: T, event: U) => any)
): null | ((this: T, event: U) => any) => {
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
