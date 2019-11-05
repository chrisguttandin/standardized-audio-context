import { TEvaluateSourceFunction } from './evaluate-source-function';

export type TEvaluateSourceFactory = (window: null | Window) => TEvaluateSourceFunction;
