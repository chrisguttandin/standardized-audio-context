export type TEventHandler<T, U extends Event = Event> = ThisType<T> & ((event: U) => void);
