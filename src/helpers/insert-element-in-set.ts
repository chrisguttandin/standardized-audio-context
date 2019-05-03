export const insertElementInSet = <T>(set: Set<T>, element: T, predicate: (element: T) => boolean): void => {
    for (const lmnt of set) {
        if (predicate(lmnt)) {
            throw Error('The set contains at least one similar element.');
        }
    }

    set.add(element);
};
