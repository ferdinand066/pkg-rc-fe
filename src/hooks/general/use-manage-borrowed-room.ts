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
import { RoomModel } from "../../model/entities/room";

type ManageBorrowedRoomProps = {
  room_id: string;
  pic_name: string;
  pic_phone_number: string;
  event_name: string;
  borrowed_date: string,
  start_borrowing_time: string,
  start_event_time: string,
  end_event_time: string,
  capacity: number,
  description: string,
  items: {
    item_id: string;
    quantity: number;
  }[],
};

const useManageBorrowedRoom = (entity: BorrowedRoomModel | null = null, selectedRoom: RoomModel | null | undefined) => {
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
      Object.keys(entity).filter((fieldName) => !['room_items', 'item_id'].includes(fieldName)).forEach((fieldName) => {
        setValue(
          fieldName as keyof ManageBorrowedRoomProps,
          (entity as any)[fieldName]!
        );
      });

      entity.borrowed_room_items?.map((item) => {
        const items = selectedRoom?.room_items?.map((item) => item.item_id);

        const idx = (items ?? []).indexOf(item.item_id);
        if (idx === undefined) return;
        if (idx < 0) return;

        setValue(`items.${idx}.item_id`, item.item_id)
        setValue(`items.${idx}.quantity`, item.quantity)

        return;
      });
      
    }
  }, [entity, setValue, selectedRoom]);

  async function handleManageBorrowedRoom(data: ManageBorrowedRoomProps) {
    // if (!role) return;
    if (formLoading) return;

    // if data.start_time format is H:i:s, change it into H:I
    data = {
      ...data,
      items: data.items.filter((d) => !!d.item_id)
    }

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

    if (entity !== null) {
      queryClient.invalidateQueries({ queryKey: ["general/borrowed-room", entity.id] });
    }
    navigate('/room-request')
  }

  async function handleAcceptBorrowedRoom(){
    if (!entity) return;
    if (formLoading) return;

    const value = getValues('start_borrowing_time');

    setFormLoading(true);
    try {
      await toast.promise(AdminBorrowedRoomService.acceptBorrowedRoom(entity.id as string, {
        start_borrowing_time: value,
      }), {
        pending: "Waiting for accept borrowed room!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });
    } catch (e) {}

    setFormLoading(false);

    queryClient.invalidateQueries({ queryKey: ["general/borrowed-room"] });

    if (entity !== null) {
      queryClient.invalidateQueries({ queryKey: ["general/borrowed-room", entity.id] });
    } else {
      navigate('/room-request');
    }
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

    queryClient.invalidateQueries({ queryKey: ["general/borrowed-room"] });

    if (entity !== null) {
      queryClient.invalidateQueries({ queryKey: ["general/borrowed-room", entity.id] });
    }
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
