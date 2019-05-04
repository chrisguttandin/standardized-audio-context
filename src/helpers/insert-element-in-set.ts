export const insertElementInSet = <T>(set: Set<T>, element: T, predicate: (element: T) => boolean, ignoreDuplicates: boolean): void => {
    for (const lmnt of set) {
        if (predicate(lmnt)) {
            if (ignoreDuplicates) {
                return;
            }

            throw Error('The set contains at least one similar element.');
        }
    }

    set.add(element);
};
