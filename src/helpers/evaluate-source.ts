export const evaluateSource = (source: string) => {
    return new Promise((resolve, reject) => {
        const head = document.head;

        if (head === null) {
            reject(new SyntaxError());
        } else {
            const script = document.createElement('script');
            // @todo Safari doesn't like URLs with a type of 'application/javascript; charset=utf-8'.
            const blob = new Blob([ source ], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);

            const originalOnErrorHandler = window.onerror;

            const removeErrorEventListenerAndRevokeUrl = () => {
                window.onerror = originalOnErrorHandler;

                URL.revokeObjectURL(url);
            };

            window.onerror = (message, src, lineno, colno, error) => {
                // @todo Edge thinks the source is the one of the html document.
                if (src === url || (src === location.href && lineno === 1 && colno === 1)) {
                    removeErrorEventListenerAndRevokeUrl();
                    reject(error);

                    return false;
                }

                if (originalOnErrorHandler !== null) {
                    return originalOnErrorHandler(message, src, lineno, colno, error);
                }
            };

            script.onerror = () => {
                removeErrorEventListenerAndRevokeUrl();
                reject(new SyntaxError());
            };
            script.onload = () => {
                removeErrorEventListenerAndRevokeUrl();
                resolve();
            };
            script.src = url;
            script.type = 'module';

            head.appendChild(script);
        }
    });
};
