import BaseModel from "./base.model";
import { IUser } from "./types";

class UserModel extends BaseModel<IUser> {
  constructor() {
    super("/user");
  }
}

export default new UserModel();
