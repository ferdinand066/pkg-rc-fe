import { UserModel } from "../../entities/user";

export type EmailVerificationResponse = {
  user: UserModel,
}