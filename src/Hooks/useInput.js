import { useState } from "react";

const useInput = (initialValue, name, type, placeholder, className, styles = {}) => {
    const [value, setValue] = useState(initialValue);

    const reset = () => setValue(null);

    const bindInput = {
        placeholder,
        type,
        className: className,
        name: name,
        style: styles,
    }

    const bindHookForm = {
        defaultValue: value,
        name: name,
    }

    return {bindInput, reset, bindHookForm}
};

export default useInput;