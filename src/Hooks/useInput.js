import { useState } from "react";

const useInput = (initialValue, name, type, placeholder, className, other = {}) => {
    const [value, setValue] = useState(initialValue);

    const reset = () => setValue(null);

    const bindInput = {
        placeholder,
        type,
        className: className,
        other
    }

    const bindHookForm = {
        defaultValue: value,
        name: name,
    }

    const bindFile = {
        type: 'file',
        className: className,
        set: setValue,
        value,
        other
    }


    return {bindInput, reset, bindHookForm, value, setValue, bindFile}
};

export default useInput;