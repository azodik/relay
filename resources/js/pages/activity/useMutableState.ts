import { useMemo, useReducer, useRef } from 'react';

export function useMutableState<T extends object>(initial: T): T {
    const [, bump] = useReducer((n: number) => n + 1, 0);
    const data = useRef(initial);

    return useMemo(() => {
        const createProxy = <V extends object>(target: V): V => {
            return new Proxy(target, {
                get(obj, prop, receiver) {
                    const value = Reflect.get(obj, prop, receiver);

                    if (
                        value !== null &&
                        typeof value === 'object' &&
                        !(value instanceof Date)
                    ) {
                        return createProxy(value as object);
                    }

                    return value;
                },
                set(obj, prop, value, receiver) {
                    const result = Reflect.set(obj, prop, value, receiver);
                    bump();

                    return result;
                },
            }) as V;
        };

        return createProxy(data.current);
    }, [bump]);
}
