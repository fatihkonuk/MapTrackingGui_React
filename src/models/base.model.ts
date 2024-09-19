import ApiService from "../services/api.service";
import { IResponse } from "../services/types";

export default class BaseModel<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(): Promise<IResponse<T[]>> {
    return ApiService.get<T[]>(this.endpoint);
  }

  async getById(id: number): Promise<IResponse<T>> {
    return ApiService.get<T>(`${this.endpoint}/${id}`);
  }

  async create(data: T): Promise<IResponse<T>> {
    return ApiService.post<T>(this.endpoint, data);
  }

  async update(id: number, data: T): Promise<IResponse<T>> {
    return ApiService.put<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number): Promise<IResponse<void>> {
    return ApiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
