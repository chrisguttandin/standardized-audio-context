import { TAnyContext } from './any-context';
import { TNativeContext } from './native-context';

export type TIsNativeContextFunction = (anyContext: TAnyContext) => anyContext is TNativeContext;
