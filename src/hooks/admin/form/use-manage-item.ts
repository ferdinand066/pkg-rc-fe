import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../../lib/functions";
import { formLoadingStateAtom } from "../../../lib/state/state";
import { ItemModel } from "../../../model/entities/item";
import { ItemService } from "../../../services/admin/item-service";

export type RoomItemFormRow = {
  room_id: string;
  quantity: number;
};

type ManageItemProps = {
  name: string;
  idle_quantity?: number;
  room_items?: RoomItemFormRow[];
};

const useManageItem = (entity: ItemModel | null = null) => {
  const {
    register,
    setValue,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<ManageItemProps>({
    defaultValues: { name: "", idle_quantity: 0, room_items: [] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "room_items",
  });
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const queryClient = useQueryClient();
  // const { role } = useUser();

  useEffect(() => {
    if (!entity) {
      reset({ name: "", idle_quantity: 0, room_items: [] });
      return;
    }
    const roomItems = (entity.room_items ?? []).map((ri) => ({
      room_id: ri.room_id,
      quantity: ri.quantity,
    }));
    reset({
      name: entity.name ?? "",
      idle_quantity: Number(entity.idle_quantity) ?? 0,
      room_items: roomItems,
    });
  }, [entity, reset]);

  async function handleManageItem(data: ManageItemProps) {
    // if (!role) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      const { room_items: _roomItems, ...restData } = data;
      const payload: Record<string, unknown> = {
        ...restData,
        idle_quantity: Number(data.idle_quantity) || 0,
      };
      if (!entity) {
        payload.room_items = (data.room_items ?? []).map((row) => ({
          room_id: row.room_id,
          quantity: Number(row.quantity) || 0,
        }));
      }
      if (entity) {
        await toast.promise(ItemService.updateItem(entity.id as string, payload), {
          pending: "Waiting for update item!",
          error: handleToastError(),
          success: handleToastSuccess(),
        });
      } else {
        await toast.promise(ItemService.createItem(payload), {
          pending: "Waiting for create item!",
          error: handleToastError(),
          success: handleToastSuccess(),
        });
      }
      queryClient.invalidateQueries({ queryKey: ["general/item"] });
      if (entity !== null) {
        queryClient.invalidateQueries({ queryKey: ["general/item", entity.id] });
      }
      reset();
      return true;
    } catch (e) {
      return false;
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteItem() {
    // if (!role) return;
    if (!entity) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(ItemService.deleteItem(entity.id as string), {
        pending: "Waiting for delete item!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["general/item"] });
      return true;
    } catch (e) {
      return false;
    } finally {
      setFormLoading(false);
    }
  }

  return {
    register,
    setValue,
    errors,
    handleManageItem,
    handleDeleteItem,
    handleSubmit,
    watch,
    roomItemFields: fields,
    appendRoomItem: append,
    removeRoomItem: remove,
  };
};

export default useManageItem;
