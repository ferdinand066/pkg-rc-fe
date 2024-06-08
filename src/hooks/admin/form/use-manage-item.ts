import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../../lib/functions";
import { formLoadingStateAtom } from "../../../lib/state/state";
import { ItemModel } from "../../../model/entities/item";
import { ItemService } from "../../../services/admin/item-service";

type ManageItemProps = {
  name: string;
};

const useManageItem = (entity: ItemModel | null = null) => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<ManageItemProps>();
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const queryClient = useQueryClient();
  // const { role } = useUser();

  useEffect(() => {
    reset();
    if (entity) {
      Object.keys(entity).forEach((fieldName) => {
        setValue(
          fieldName as keyof ManageItemProps,
          (entity as any)[fieldName]!
        );
      });
    }
  }, [entity, setValue]);

  async function handleManageItem(data: ManageItemProps) {
    // if (!role) return;
    if (formLoading) return;

    setFormLoading(true);
    try {
      if (entity) {
        await toast.promise(ItemService.updateItem(entity.id as string, data), {
          pending: "Waiting for update item!",
          error: handleToastError(),
          success: handleToastSuccess(),
        });
      } else {
        await toast.promise(ItemService.createItem(data), {
          pending: "Waiting for create item!",
          error: handleToastError(),
          success: handleToastSuccess(),
        });
      }
    } catch (e) {}

    queryClient.invalidateQueries({ queryKey: ["general/item"] });

    if (entity !== null) {
      queryClient.invalidateQueries({ queryKey: ["general/item", entity.id] });
    }

    reset();

    setFormLoading(false);
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
    } catch (e) {}

    setFormLoading(false);
    reset();
    queryClient.invalidateQueries({ queryKey: ["general/item"] });
  }

  return {
    register,
    setValue,
    errors,
    handleManageItem,
    handleDeleteItem,
    handleSubmit,
    watch,
  };
};

export default useManageItem;
