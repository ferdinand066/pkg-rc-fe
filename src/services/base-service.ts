import axios, { AxiosError } from "axios";
import { ErrorResponse } from "../model/service";

export class BaseService {
  static async _get<T = unknown>(
    url: string,
    params: object | null = null,
    options: object | null = null
  ) {
    try {
      const resp = await axios.get<T>(url, {
        ...options,
        params: params,
      });

      return resp?.data;
    } catch (e: unknown) {
      const errorValue = e as AxiosError<ErrorResponse>;
      if (errorValue.response && errorValue.response.status === 401) {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
        window.location.reload();
      } else {
        throw new Error(errorValue.response?.data?.message ?? errorValue.message);
      }
    }
  }

  static async _post<T = unknown>(url: string, body: object, options: object | null = null) {
    try {
      const resp = await axios.post<T>(url, body, {
        ...options,
      });

      return resp?.data;
    } catch (e: unknown) {
      const errorValue = e as AxiosError<ErrorResponse>;
      throw new Error(errorValue.response?.data?.message ?? errorValue.message);
    }
  }

  static async _patch<T = unknown>(
    url: string,
    body: object,
    options: object | null = null
  ) {
    return await this._post<T>(url, { ...body, _method: "PATCH" }, options);
  }

  static async _delete<T = unknown>(
    url: string,
    body: object,
    options: object | null = null
  ) {
    return await this._post<T>(url, { ...body, _method: "DELETE" }, options);
  }
}
