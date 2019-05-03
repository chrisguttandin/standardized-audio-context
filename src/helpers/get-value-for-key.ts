export const getValueForKey = <T, U>(map: T extends object ? Map<T, U> | WeakMap<T, U> : Map<T, U>, key: T): U => {
    const value = map.get(key);

    if (value === undefined) {
        throw new Error('A value with the given key could not be found.');
    }

    return value;
};
