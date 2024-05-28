import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const formLoadingStateAtom = atom(false);
export const navbarInitialLoadAtom = atom(false);
export const previewImageUrlAtom = atom("");
export const appThemeAtom = atomWithStorage("theme", "light");