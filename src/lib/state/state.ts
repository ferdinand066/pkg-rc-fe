import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Theme } from "react-toastify";

export const formLoadingStateAtom = atom(false);
export const navbarInitialLoadAtom = atom(false);
export const previewImageUrlAtom = atom("");
export const appThemeAtom = atomWithStorage<Theme>("theme", "light");