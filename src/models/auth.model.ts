import ApiService from "../services/api.service";
import { IResponse } from "../services/types";
import { IAuth, ILogin, IRegister } from "./types";

class AuthModel {
  async login(auth: ILogin): Promise<IResponse<IAuth>> {
    return ApiService.post<IAuth>("/auth/login", auth);
  }

  async register(credentials: IRegister): Promise<IResponse<IAuth>> {
    return ApiService.post<IAuth>("/auth/register", credentials);
  }
}

export default new AuthModel();
