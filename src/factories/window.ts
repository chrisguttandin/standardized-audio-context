import { TWindowFactory } from '../types';

export const createWindow: TWindowFactory = () => (typeof window === 'undefined') ? null : window;
