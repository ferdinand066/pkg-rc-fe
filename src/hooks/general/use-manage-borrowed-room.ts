import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BorrowedRoomModel } from "../../model/entities/borrowed-room";
import { formLoadingStateAtom } from "../../lib/state/state";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { BorrowedRoomService } from "../../services/general/borrowed-room-service";
import { BorrowedRoomService as AdminBorrowedRoomService } from "../../services/admin/borrowed-room-service";
import { useNavigate } from "react-router-dom";

type ManageBorrowedRoomProps = {
  room_id: string;
  borrowed_date: string,
  start_time: string,
  end_time: string,
  item_id: string[];
  reason: string,
};

const useManageBorrowedRoom = (entity: BorrowedRoomModel | null = null) => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<ManageBorrowedRoomProps>();
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const { role } = useUser();

  useEffect(() => {
    reset();
    if (entity) {
      console.log(entity);
      Object.keys(entity).filter((fieldName) => fieldName !== 'item_id').forEach((fieldName) => {
        setValue(
          fieldName as keyof ManageBorrowedRoomProps,
          (entity as any)[fieldName]!
        );
      });

      entity.item_id?.map((item, idx) => {
        console.log(idx);
        console.log(item);
        return setValue(`item_id.${idx}`, item)
      });
      console.log(getValues('item_id'));
    }
  }, [entity, setValue]);

  async function handleManageBorrowedRoom(data: ManageBorrowedRoomProps) {
    // if (!role) return;
    if (formLoading) return;

    // if data.start_time format is H:i:s, change it into H:I
    data = {
      ...data,
      item_id: (data.item_id ?? []).filter((d) => !!d)
    }

    console.log(data);

    setFormLoading(true);
    try {
      if (entity) {
        await toast.promise(BorrowedRoomService.updateBorrowedRoom(entity.id as string, data), {
          pending: "Waiting for update borrowed room!",
          error: handleToastError(),
          success: handleToastSuccess(),
        });
      } else {
        await toast.promise(BorrowedRoomService.createBorrowedRoom(data), {
          pending: "Waiting for create borrowed room!",
          error: handleToastError(),
          success: handleToastSuccess(),
        });
      }
    } catch (e) {}

    queryClient.invalidateQueries({ queryKey: ["general/borrowed-room"] });

    if (entity !== null) {
      queryClient.invalidateQueries({ queryKey: ["general/borrowed-room", entity.id] });
    }

    reset();

    setFormLoading(false);
  }

  async function handleDeleteBorrowedRoom() {
    // if (!role) return;
    if (!entity) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(BorrowedRoomService.deleteBorrowedRoom(entity.id as string), {
        pending: "Waiting for delete borrowed room!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });
    } catch (e) {}

    setFormLoading(false);
    reset();
    queryClient.invalidateQueries({ queryKey: ["general/borrowed-room"] });
    navigate('/room-request')
  }

  async function handleAcceptBorrowedRoom(){
    if (!entity) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(AdminBorrowedRoomService.acceptBorrowedRoom(entity.id as string), {
        pending: "Waiting for accept borrowed room!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });
    } catch (e) {}

    setFormLoading(false);
  }

  async function handleDeclineBorrowedRoom(){
    if (!entity) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(AdminBorrowedRoomService.declineBorrowedRoom(entity.id as string), {
        pending: "Waiting for decline borrowed room!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });
    } catch (e) {}

    setFormLoading(false);
  }

  return {
    register,
    setValue,
    errors,
    handleManageBorrowedRoom,
    handleDeleteBorrowedRoom,
    handleAcceptBorrowedRoom,
    handleDeclineBorrowedRoom,
    handleSubmit,
    watch,
    getValues,
  };
};

export default useManageBorrowedRoom;
