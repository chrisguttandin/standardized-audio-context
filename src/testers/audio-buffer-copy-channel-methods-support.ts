export class AudioBufferCopyChannelMethodsSupportTester {

    public test (audioContext) {
        const audioBuffer = audioContext.createBuffer(1, 1, audioContext.sampleRate);
        const source = new Float32Array(2);

        try {
            /*
             * Only Firefox does not fully support the copyFromChannel() and copyToChannel() methods. Therefore testing one of those
             * methods is enough to know if the other one it supported as well.
             */
            audioBuffer.copyToChannel(source, 0);
        } catch (err) {
            return false;
        }

        return true;
    }

}
