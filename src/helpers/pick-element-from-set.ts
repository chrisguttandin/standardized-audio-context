export const pickElementFromSet = <T>(set: Set<T>, predicate: (element: T) => boolean): T => {
    const matchingElements = Array.from(set).filter(predicate);

    if (matchingElements.length > 1) {
        throw Error('More than one element was found.');
    }

    if (matchingElements.length === 0) {
        throw Error('No element was found.');
    }

    const [matchingElement] = matchingElements;

    set.delete(matchingElement);

    return matchingElement;
};
