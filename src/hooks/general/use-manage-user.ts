import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ADMIN_ROLE_INT } from "../../lib/constants";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { formLoadingStateAtom } from "../../lib/state/state";
import { UserModel } from "../../model/entities/user";
import { UserService as AdminUserService } from "../../services/admin/user-service";
import { UserService as GeneralUserService } from "../../services/general/user-service";
import useAuth from "./use-auth-user";
import { useNavigate } from "react-router-dom";

type UpdateUserProps = {
  name: string;
  email: string;
  address: string;
  role: number;
};

const useUpdateUser = (entity: UserModel | null = null) => {
  const { user } = useAuth();
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<UpdateUserProps>();
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    reset();
    if (entity) {
      Object.keys(entity).forEach((fieldName) => {
        setValue(
          fieldName as keyof UpdateUserProps,
          (entity as any)[fieldName]!
        );
      });
    }
  }, [entity, setValue]);

  async function handleUpdateProfile(data: UpdateUserProps) {
    if (!user) return;
    if (!entity) return;
    if (user.id !== entity?.id) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(
        GeneralUserService.updateUserProfile(data),
        {
          pending: "Waiting for update profile!",
          error: handleToastError(),
          success: handleToastSuccess(),
        }
      );
    } catch (e) {}

    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setFormLoading(false);
  }

  async function handleUpdateRole(data: UpdateUserProps) {
    if (!user) return;
    if (!entity) return;
    if (user.role !== ADMIN_ROLE_INT) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(
        AdminUserService.updateUserRole(entity.id as string, data),
        {
          pending: "Waiting for update user role!",
          error: handleToastError(),
          success: handleToastSuccess(),
        }
      );
    } catch (e) {}

    queryClient.invalidateQueries({ queryKey: ["admin/user", entity?.id] });
    setFormLoading(false);
  }

  async function handleActivateUser() {
    if (!user) return;
    if (!entity) return;
    if (user.role !== ADMIN_ROLE_INT) return;

    setFormLoading(true);
    try {
      await toast.promise(
        AdminUserService.activateUser(entity.id as string),
        {
          pending: "Waiting for activate user!",
          error: handleToastError(),
          success: handleToastSuccess(),
        }
      );
    } catch (e) {}

    queryClient.invalidateQueries({ queryKey: ["admin/user", entity?.id] });
    setFormLoading(false);
  }

  async function handleRejectUser() {
    if (!user) return;
    if (!entity) return;
    if (user.role !== ADMIN_ROLE_INT) return;

    setFormLoading(true);
    try {
      await toast.promise(
        AdminUserService.rejectUser(entity.id as string),
        {
          pending: "Waiting for reject user!",
          error: handleToastError(),
          success: handleToastSuccess(),
        }
      );
    } catch (e) {}

    queryClient.invalidateQueries({ queryKey: ["admin/user"] });
    navigate('/admin/user');
    setFormLoading(false);
  }

  return {
    register,
    setValue,
    errors,
    handleActivateUser,
    handleRejectUser,
    handleUpdateProfile,
    handleUpdateRole,
    handleSubmit,
  };
};

export default useUpdateUser;
