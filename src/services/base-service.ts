import axios from "axios";



export class BaseService {
  static async _get(
    url: string,
    params: object | null = null,
    options: object | null = null
  ) {
    try {
      const { data } = await axios.get(url, {
        ...options,
        params: params,
      });

      return data;
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response && e.response.status === 401) {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.reload();
      } else {
        throw new Error(e.response.data?.message);
      }
    }
  }

  static async _post(url: string, body: object, options: object | null = null) {
    try {
      const { data } = await axios.post(url, body, {
        ...options,
      });

      return data;
    } catch (e: any) {
      throw new Error(e.response.data?.message);
    }
  }

  static async _patch(
    url: string,
    body: object,
    options: object | null = null
  ) {
    return await this._post(url, { ...body, _method: "PATCH" }, options);
  }

  static async _delete(
    url: string,
    body: object,
    options: object | null = null
  ) {
    return await this._post(url, { ...body, _method: "DELETE" }, options);
  }
}