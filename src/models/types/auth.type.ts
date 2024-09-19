export default interface IAuth {
  id?: number;
  fullname: string;
  role: string;
  token: string;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface IRegister {
  fullName: string;
  username: string;
  password: string;
  role?: string;
}
