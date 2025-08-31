import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { formLoadingStateAtom } from "../../lib/state/state";
import { BorrowedRoomService } from "../../services/general/borrowed-room-service";

type ManageBorrowedRoomProps = {
  event_name: string;
  recurring: "daily" | "weekly" | "monthly";

  pic_name: string;
  pic_phone_number: string;
  start_borrowed_date: string;
  end_borrowed_date: string;

  capacity: number;
  room_id: string;

  start_borrowing_time: string;
  start_event_time: string;
  end_event_time: string;

  description: string;
  items: {
    item_id: string;
    quantity: number;
  }[];
};

const useManageRecurringBorrowRoom = () => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    formState,
  } = useForm<ManageBorrowedRoomProps>();
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleManageBorrowedRoom(data: ManageBorrowedRoomProps) {
    // if (!role) return;
    if (formLoading) return;

    // if data.start_time format is H:i:s, change it into H:I
    data = {
      ...data,
      items: data.items.filter((d) => !!d.item_id),
    };

    setFormLoading(true);
    try {
      await toast.promise(
        BorrowedRoomService.createRecurringBorrowedRoom(data),
        {
          pending: "Waiting for create borrowed room!",
          error: handleToastError(),
          success: handleToastSuccess(),
        }
      );
    } catch {
      // Ignore for catch
    }

    queryClient.invalidateQueries({ queryKey: ["general/borrowed-room"] });

    setFormLoading(false);
    reset();
    navigate("/room-request");
  }

  return {
    register,
    setValue,
    errors,
    handleManageBorrowedRoom,
    handleSubmit,
    watch,
    getValues,
    formState,
  };
};

export default useManageRecurringBorrowRoom;
