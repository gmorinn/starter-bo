import { useCallback, useState } from "react";

const useArray = (value) => {
    const [array, setArray] = useState(value)

    const push = useCallback(
        element => setArray(arr => [...arr, element]),
    [])

    const pushBegin = useCallback(
        element => setArray(arr => [element, ...arr]),
    [])

    const filter = useCallback(
        callback => setArray(arr => arr.filter(callback)),
    [])

    const update = useCallback(
        (index, element) => setArray(arr => [
            ...arr.slice(0, index),
            element,
            ...arr.slice(index + 1, arr.length)
        ]),
    [])

    const removeFirstItem = useCallback(
        () => setArray(arr => arr.slice(1, arr.length)),
    [])

    const removeLastItem = useCallback(
        () => setArray(arr => arr.splice(0, arr.length - 1)),
    [])

    const removeAtIndex = useCallback((index = 0) => 
        setArray(arr => [...arr.slice(0, index), ...arr.slice(index + 1)]),
    [])

    const clear = useCallback(
        () => setArray([]),
    [])

    return {
        array,
        set: setArray,
        push,
        pushBegin,
        filter,
        update,
        removeAtIndex,
        removeFirstItem,
        removeLastItem,
        clear
    }
}

export default useArray