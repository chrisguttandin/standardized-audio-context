export const assignNativeAudioNodeOption = <T extends any, U extends T, V extends Partial<T>> (
    nativeAudioNode: U,
    options: V,
    option: keyof T
) => {
    const value = options[option];

    if (value !== undefined && value !== nativeAudioNode[option]) {
        nativeAudioNode[option] = value;
    }
};
