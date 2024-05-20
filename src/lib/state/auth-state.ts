import { atom } from "jotai";
import { getEncryptedCookie, removeCookie } from "./cookie-encrypt";
import axios from "axios";

export type TokenData = {
  token: string;
  expiresAt: string;
  roleId: string;
};

const slug = 'token';
const tokenData = getEncryptedCookie<TokenData>(slug) as TokenData | null;

const isTokenValid = tokenData && new Date(parseInt(tokenData.expiresAt) * 1000) > new Date();

if (!isTokenValid){
  removeCookie(slug);
  delete axios.defaults.headers.common["Authorization"];
}

const authAtom = atom(isTokenValid ? tokenData : null);

export { authAtom };