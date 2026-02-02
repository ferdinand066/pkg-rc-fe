import { useParams, useNavigate } from "react-router-dom";
import InputText from "../../../../components/forms/input-text";
import InputSelect from "../../../../components/forms/input-select";
import PageHeader from "../../../../components/layout/page-header";
import Table from "../../../../components/utils/table";
import useManageItem from "../../../../hooks/admin/form/use-manage-item";
import { useGetOneItem } from "../../../../hooks/general/use-item";
import { useFetchRoom } from "../../../../hooks/general/use-room";
import { ItemModel } from "../../../../model/entities/item";
import { RoomModel } from "../../../../model/entities/room";

const ItemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreate = !id;

  const { data: selectedItem, status } = useGetOneItem(id ?? "");
  const item: ItemModel | null = isCreate ? null : selectedItem ?? null;

  const { data: rooms } = useFetchRoom<RoomModel[]>({}, {}, false);
  const {
    register,
    setValue,
    errors,
    handleManageItem,
    handleDeleteItem,
    handleSubmit,
    watch,
    roomItemFields,
    appendRoomItem,
    removeRoomItem,
  } = useManageItem(item);

  const watchedRoomItems = watch("room_items") ?? [];
  const getAvailableRoomsForIndex = (currentIndex: number) => {
    const selectedElsewhere = new Set(
      watchedRoomItems
        .map((row, i) => (i !== currentIndex && row?.room_id ? String(row.room_id) : null))
        .filter(Boolean) as string[]
    );
    return (rooms ?? []).filter(
      (room) =>
        !selectedElsewhere.has(String(room.id)) ||
        String(watchedRoomItems[currentIndex]?.room_id) === String(room.id)
    );
  };

  const onSubmit = async (data: { name: string; idle_quantity?: number }) => {
    const success = await handleManageItem(data);
    if (success) navigate("/inventory/item");
  };

  const onDelete = async () => {
    const success = await handleDeleteItem();
    if (success) navigate("/inventory/item");
  };

  if (!isCreate && status === "pending") {
    return (
      <section className="flex flex-col h-full flex-1 gap-4">
        <PageHeader pageName="Memuat..." />
        <div className="px-6">Memuat barang...</div>
      </section>
    );
  }

  if (!isCreate && status === "success" && !selectedItem) {
    return (
      <section className="flex flex-col h-full flex-1 gap-4">
        <PageHeader pageName="Barang tidak ditemukan" />
        <div className="px-6">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/inventory/item")}
          >
            Kembali ke Daftar Barang
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader pageName={isCreate ? "Buat Barang" : "Ubah Barang"} />
      <div className="px-6 pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-4">
              <InputText
                label="Nama Barang"
                type="text"
                name="name"
                register={register("name", {
                  required: "Nama barang harus diisi",
                })}
                setValue={setValue}
                placeholder="Cth: Speaker Portable"
                errors={errors}
              />
            </div>
            <div className="col-span-2">
              <InputText
                label="Jumlah Idle"
                type="number"
                name="idle_quantity"
                register={register("idle_quantity", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Jumlah idle tidak boleh negatif" },
                })}
                setValue={setValue}
                placeholder="0"
                errors={errors}
                disabled={!isCreate}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Jumlah per Ruangan</h4>
            {isCreate ? (
              <>
                {roomItemFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-6 gap-2 items-end"
                  >
                    <div className="col-span-3">
                      <InputSelect
                        label={index === 0 ? "Ruangan" : undefined}
                        name={`room_items.${index}.room_id`}
                        register={register(`room_items.${index}.room_id`, {
                          required: "Ruangan harus dipilih",
                        })}
                        setValue={setValue}
                        model={getAvailableRoomsForIndex(index)}
                        errors={errors}
                      />
                    </div>
                    <div className="col-span-2">
                      <InputText
                        label={index === 0 ? "Jumlah" : undefined}
                        type="number"
                        name={`room_items.${index}.quantity`}
                        register={register(`room_items.${index}.quantity`, {
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: "Jumlah harus lebih dari nol",
                          },
                        })}
                        setValue={setValue}
                        placeholder="0"
                        errors={errors}
                      />
                    </div>
                    <div className="col-span-1 flex items-end pb-2">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square"
                        onClick={() => removeRoomItem(index)}
                        aria-label="Hapus ruangan"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline w-fit"
                  onClick={() => appendRoomItem({ room_id: "", quantity: 0 })}
                >
                  Tambah Ruangan
                </button>
              </>
            ) : (
              <Table
                header={[
                  { name: "ruangan", sortable: false },
                  { name: "jumlah", sortable: false },
                ]}
                data={(item?.room_items ?? []).map((ri) => ({
                  ruangan: ri.room?.name ?? "-",
                  jumlah: ri.quantity,
                }))}
                status="success"
              />
            )}
          </div>
          <div className="flex flex-row justify-between gap-2">
            <button
              className="btn w-20 bg-base-100 hover:bg-gray-200 border-none"
              type="button"
              onClick={() => navigate("/inventory/item")}
            >
              Kembali
            </button>
            <div className="flex flex-row gap-2">
              <button className="btn btn-primary" type="submit">
                {isCreate ? "Buat" : "Ubah"}
              </button>
              {!isCreate && (
                <button
                  className="btn btn-error"
                  type="button"
                  onClick={onDelete}
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ItemDetailPage;
