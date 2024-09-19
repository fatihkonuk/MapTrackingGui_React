import { AxiosRequestConfig } from "axios";
import { axios } from "../plugins";
import JwtService from "./jwt.service";
import { IResponse } from "./types";

export default class ApiService {
  static baseUrl: string = "http://localhost:5260/api";

  static async request<T>(
    resource: string,
    method: string = "GET",
    params: Record<string, any> | null = null
  ): Promise<IResponse<T>> {
    const auth = JwtService.getAuth();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (auth && auth.token) {
      headers["Authorization"] = `Bearer ${auth.token}`;
    }

    const options: AxiosRequestConfig = {
      url: `${this.baseUrl}${resource}`,
      method,
      headers,
      data: params,
    };

    try {
      const response = await axios.request<IResponse<T>>(options);
      return ApiService.handleResponse<T>(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Network Error: ${error.message}`);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }

  static handleResponse<T>(responseData: IResponse<T>): IResponse<T> {
    if (
      typeof responseData.success === "boolean" &&
      typeof responseData.message === "string" &&
      "data" in responseData
    ) {
      return responseData;
    } else {
      throw new Error("Unexpected response format");
    }
  }

  static get<T>(resource: string): Promise<IResponse<T>> {
    return ApiService.request<T>(resource);
  }

  static post<T>(
    resource: string,
    params: Record<string, any>
  ): Promise<IResponse<T>> {
    return ApiService.request<T>(resource, "POST", params);
  }

  static put<T>(
    resource: string,
    params: Record<string, any>
  ): Promise<IResponse<T>> {
    return ApiService.request<T>(resource, "PUT", params);
  }

  static delete<T>(resource: string): Promise<IResponse<T>> {
    return ApiService.request<T>(resource, "DELETE");
  }
}
