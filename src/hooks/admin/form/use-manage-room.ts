import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../../lib/functions";
import { formLoadingStateAtom } from "../../../lib/state/state";
import { RoomModel } from "../../../model/entities/room";
import { RoomService } from "../../../services/admin/room-service";
import { useEffect } from "react";

type ManageRoomProps = {
  name: string;
  floor_id: string;
  capacity: number;
};

const useManageRoom = (entity: RoomModel | null = null) => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<ManageRoomProps>();
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const queryClient = useQueryClient();


  useEffect(() => {
    reset();
    if (entity) {
      Object.keys(entity).forEach((fieldName) => {
        setValue(
          fieldName as keyof ManageRoomProps,
          (entity as Record<string, unknown>)[fieldName as keyof RoomModel] as string
        );
      });
    }
  }, [entity, setValue, reset]);

  async function handleManageRoom(data: ManageRoomProps) {
    // if (!role) return;
    if (formLoading) return;

    setFormLoading(true);
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

    queryClient.invalidateQueries({ queryKey: ["general/room"] });

    if (entity !== null) {
      queryClient.invalidateQueries({ queryKey: ["general/room", entity.id] });
    }

    reset();

    setFormLoading(false);
  }

  async function handleDeleteRoom() {
    // if (!role) return;
    if (!entity) return;
    if (formLoading) return;

    setFormLoading(true);
    await toast.promise(RoomService.deleteRoom(entity.id as string), {
      pending: "Waiting for delete room!",
      error: handleToastError(),
      success: handleToastSuccess(),
    });

    setFormLoading(false);
    reset();
    queryClient.invalidateQueries({ queryKey: ["general/room"] });
  }

  return {
    register,
    setValue,
    getValues,
    errors,
    handleManageRoom,
    handleDeleteRoom,
    handleSubmit,
    watch,
  };
};

export default useManageRoom;
