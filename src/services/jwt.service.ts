import IAuth from "../models/types/auth.type";

class JwtService {
  static readonly storageKey: string = "auth";

  static setAuth(auth: IAuth): void {
    localStorage.setItem(this.storageKey, JSON.stringify(auth));
  }

  static getAuth(): IAuth | null {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  static removeAuth(): void {
    localStorage.removeItem(this.storageKey);
  }

  static isTokenAvailable(): boolean {
    return this.getAuth() !== null;
  }
}

export default JwtService;
