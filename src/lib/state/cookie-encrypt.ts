import Cookies from "js-cookie";
import * as CryptoJS from "crypto-js";


function setEncryptedCookie(
  slug: string,
  data: string | object,
  duration: string
) {
  const key = __APP_KEY__;
  const convertedData = typeof data === "string" ? data : JSON.stringify(data);

  const encryptedData = CryptoJS.AES.encrypt(convertedData, key).toString();
  Cookies.set(slug, encryptedData, { expires: new Date(duration) });
}

function getEncryptedCookie<T>(slug: string): T | null | string {
  const key = __APP_KEY__;
  const encryptedData = Cookies.get(slug);

  if (encryptedData) {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(
      CryptoJS.enc.Utf8
    );
    
    try {
      const parsedData: T = JSON.parse(decryptedData);
      return parsedData;
    } catch (error) {
      return decryptedData;
    }
  }

  return null;
}

function removeCookie(slug: string){
  Cookies.remove(slug);
}

export { getEncryptedCookie, setEncryptedCookie, removeCookie };
