import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../../lib/functions";
import { formLoadingStateAtom } from "../../../lib/state/state";
import { RoomModel } from "../../../model/entities/room";
import { RoomService } from "../../../services/admin/room-service";

type ManageRoomProps = {
  name: string;
  floor_id: string;
  room_id: string[];
};

const useManageRoom = (entity: RoomModel | null = null) => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<ManageRoomProps>();
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const queryClient = useQueryClient();
  // const { role } = useUser();

  useEffect(() => {
    if (entity) {
      Object.keys(entity).forEach((fieldName) => {
        setValue(
          fieldName as keyof ManageRoomProps,
          (entity as any)[fieldName]!
        );
      });
    } else {
      reset();
    }
  }, [entity, setValue]);

  async function handleManageRoom(data: ManageRoomProps) {
    // if (!role) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      if (entity) {
        await toast.promise(RoomService.updateRoom(entity.id as string, data), {
          pending: "Waiting for update room!",
          error: handleToastError(),
          success: handleToastSuccess(),
        });
      } else {
        await toast.promise(RoomService.createRoom(data), {
          pending: "Waiting for create room!",
          error: handleToastError(),
          success: handleToastSuccess(),
        });
      }
    } catch (e) {}

    queryClient.invalidateQueries({ queryKey: ["general/room"] });

    if (entity !== null) {
      queryClient.invalidateQueries({ queryKey: ["general/room", entity.id] });
    }

    setFormLoading(false);
  }

  async function handleDeleteRoom() {
    // if (!role) return;
    if (!entity) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(RoomService.deleteRoom(entity.id as string), {
        pending: "Waiting for delete room!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });
    } catch (e) {}

    setFormLoading(false);
    queryClient.invalidateQueries({ queryKey: ["general/room"] });
  }

  return {
    register,
    setValue,
    errors,
    handleManageRoom,
    handleDeleteRoom,
    handleSubmit,
    watch,
  };
};

export default useManageRoom;
