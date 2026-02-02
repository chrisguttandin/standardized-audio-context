import { page } from 'vitest/browser';

export const resumeAudioContext = async (audioContext) => {
    if (audioContext.state === 'running') {
        return;
    }

    const { promise, resolve } = Promise.withResolvers();
    const button = document.createElement('button');

    audioContext.onstatechange = () => {
        if (audioContext.state === 'running') {
            audioContext.onstatechange = null;

            document.body.removeChild(button);
            resolve();
        }
    };
    button.onclick = () => {
        button.onclick = null;

        audioContext.resume();
    };
    button.textContent = `${Date.now()}-${Math.floor(Math.random() * 2 ** 32)}`;

    document.body.appendChild(button);

    try {
        await Promise.race([page.getByRole('button', { name: button.textContent }).click(), promise]);
    } catch {
        // Ignore errors.
    }

    await promise;
};
