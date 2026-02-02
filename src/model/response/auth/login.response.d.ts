import { UserModel } from "../../entities/user";

export type LoginResponse = {
  token: string;
  user: UserModel;
  expires_in: number;
};
