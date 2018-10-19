import { TFetchSourceFunction } from './fetch-source-function';

export type TFetchSourceFunction = (url: string) => Promise<string>;
