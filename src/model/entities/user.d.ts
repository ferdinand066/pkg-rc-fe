
import { GeneralData } from "../components/general-data"
import { UserCurrentBranchModel } from "./branch"
import { EmployeeModel } from "./employee"
import { UserRoleModel } from "./roles"

export type UserModel = GeneralData & {
  role: number,
  email: string,
  address: string,
  suspended_at?: Date,
  email_verified_at?: Date,
  account_accepted_at?: Date,
  account_accepted_by?: string,
}

export type UserEmployeeModel = {
  employee: EmployeeModel,
  employee_id: string,
  user: UserModel,
}

export type UserBranch = {
  user_id: string;
  id: string;
  branch_id: string;
  created_at: Date;
  updated_at: Date;
  branch: BranchModel;
};