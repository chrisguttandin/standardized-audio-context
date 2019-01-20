export const assignNativeAudioNodeOption = <T extends { [ key: string ]: any }, U extends { [ key: string ]: any }> (
    nativeAudioNode: T,
    options: U,
    option: keyof T & keyof U
) => {
    const value = options[option];

    if (value !== undefined && value !== nativeAudioNode[option]) {
        nativeAudioNode[option] = value;
    }
};
