import { atom } from "recoil";

export const darkModeAtom = atom({
    key: 'darkModeAtom',
    default: JSON.parse(localStorage.getItem("isDark")) || false
})
