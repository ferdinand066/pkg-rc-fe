import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import InputSelect from "../../../../components/forms/input-select";
import InputText from "../../../../components/forms/input-text";
import { useFetchRoom } from "../../../../hooks/general/use-room";
import { useFetchItem } from "../../../../hooks/general/use-item";
import { ItemHistoryService } from "../../../../services/admin/item-history-service";
import { RoomModel } from "../../../../model/entities/room";
import { ItemModel } from "../../../../model/entities/item";
import { TYPE_OPTIONS } from "../constants";

export type AddTransactionModalProps = {
  room?: RoomModel | null;
  item?: ItemModel | null;
  type?: "added" | "removed";
  quantity?: number;
};

type AddTransactionFormValues = {
  room_id: string;
  item_id: string;
  type: "added" | "removed";
  quantity: number;
};

const AddTransactionModal = forwardRef<HTMLDialogElement, AddTransactionModalProps>(
  (props, ref) => {
    const queryClient = useQueryClient();
    const { data: rooms, status: roomStatus } = useFetchRoom(
      { },
      { order_by: "name", data_order: "asc" },
      false
    );
    const { data: items, status: itemStatus } = useFetchItem(
      { },
      { order_by: "name", data_order: "asc" },
      false
    );

    const {
      register,
      setValue,
      formState: { errors },
      handleSubmit,
      reset,
    } = useForm<AddTransactionFormValues>({
      defaultValues: {
        room_id: props.room?.id?.toString() ?? "",
        item_id: props.item?.id?.toString() ?? "",
        type: props.type ?? "added",
        quantity: props.quantity ?? 1,
      },
    });

    const createMutation = useMutation({
      mutationFn: (data: AddTransactionFormValues) =>
        ItemHistoryService.createItemHistory({
          room_id: data.room_id || null,
          item_id: data.item_id,
          type: data.type,
          quantity: Number(data.quantity),
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin/item-history"] });
        toast.success("Transaksi berhasil ditambahkan.");
        reset();
        (ref as React.RefObject<HTMLDialogElement>).current?.close();
      },
      onError: () => {
        toast.error("Gagal menambah transaksi.");
      },
    });

    const onSubmit = handleSubmit((data) => {
      createMutation.mutate(data);
    });

    const roomList = (rooms as RoomModel[] | undefined) ?? [];
    const itemList = (items as ItemModel[] | undefined) ?? [];

    return (
      <>
        <h3 className="font-bold text-lg">Tambah Transaksi</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          {roomStatus === "success" ? (
            <InputSelect
              label="Ruangan"
              name="room_id"
              register={register("room_id")}
              setValue={setValue}
              model={roomList}
              errors={errors}
              emptyOption={{ value: "", label: "Barang Idle" }}
            />
          ) : null}
          {itemStatus === "success" ? (
            <InputSelect
              label="Barang"
              name="item_id"
              register={register("item_id", {
                required: "Barang harus diisi",
              })}
              setValue={setValue}
              model={itemList}
              errors={errors}
            />
          ) : null}
          <InputSelect
            label="Tipe"
            name="type"
            register={register("type", {
              required: "Tipe harus diisi",
            })}
            setValue={setValue}
            model={[...TYPE_OPTIONS]}
            errors={errors}
          />
          <InputText
            label="Jumlah"
            type="number"
            name="quantity"
            register={register("quantity", {
              required: "Jumlah harus diisi",
              min: { value: 1, message: "Jumlah minimal 1" },
            })}
            setValue={setValue}
            min={1}
            errors={errors}
          />
          <div className="modal-action flex justify-end">
            <button
              className="btn"
              type="button"
              onClick={() =>
                (ref as React.RefObject<HTMLDialogElement>).current?.close()
              }
            >
              Tutup
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Loading..." : "Tambah"}
            </button>
          </div>
        </form>
      </>
    );
  }
);

AddTransactionModal.displayName = "AddTransactionModal";

export default AddTransactionModal;
