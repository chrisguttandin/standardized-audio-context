// This is removing the deprecated functions setOrientation() and setPosition() from the native PannerNode type.
export type TNativePannerNode = Pick<PannerNode, Exclude<keyof PannerNode, 'setOrientation' | 'setPosition'>>;
