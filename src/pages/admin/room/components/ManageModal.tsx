import { forwardRef, useEffect, useState } from "react";
import InputSelect from "../../../../components/forms/InputSelect";
import InputText from "../../../../components/forms/InputText";
import InputToggle from "../../../../components/forms/InputToggle";
import useManageRoom from "../../../../hooks/admin/form/use-manage-room";
import { useFetchFloor } from "../../../../hooks/general/use-floor";
import { useFetchItem } from "../../../../hooks/general/use-item";
import { RoomModel } from "../../../../model/entities/room";

type RoomManageModalProps = {
  selectedRoom: RoomModel | undefined;
};

const RoomManageModal = forwardRef<HTMLDialogElement, RoomManageModalProps>(
  ({ selectedRoom }, ref) => {
    const { data: floors, status: floorStatus } = useFetchFloor({
      orderBy: 'created_at',
      dataOrder: 'asc',
    });
    const { data: items, status: itemStatus } = useFetchItem({});
    const [selectedData, setSelectedData] = useState(selectedRoom);

    useEffect(() => {
      if (itemStatus !== "success") return;
      if (!selectedRoom) {
        setSelectedData(undefined);
        return;
      }

      const map = new Map<string, number>();
      items?.forEach((item, index) => map.set(item.id as string, index));

      const newArray = new Array<string>(items?.length ?? 0);

      for (const key of selectedRoom?.item_id ?? []) {
        const index = map.get(key);
        if (index !== undefined) {
          newArray[index] = key;
        }
      }

      const newData = {
        ...selectedRoom,
        item_id: newArray,
      };

      setSelectedData(newData);
    }, [itemStatus, selectedRoom]);

    const {
      register,
      setValue,
      errors,
      handleManageRoom,
      handleDeleteRoom,
      handleSubmit,
      watch,
    } = useManageRoom(selectedData);

    return (
      <>
        <h3 className="font-bold text-lg">
          {!selectedRoom ? "Buat Ruangan" : "Ubah Ruangan"}
        </h3>
        <form
          onSubmit={handleSubmit(async (data) => {
            await handleManageRoom(data);
            (ref as React.RefObject<HTMLDialogElement>).current?.close();
          })}
          className="flex flex-col gap-2"
        >
          <InputText
            label="Nama Ruangan"
            type="text"
            name="name"
            register={register("name", {
              required: "Nama ruangan harus diisi",
            })}
            setValue={setValue}
            placeholder="Cth: Bartolomeus"
            errors={errors}
          />
          {floorStatus === "success" ? (
            <InputSelect
              label="Lantai"
              name="floor_id"
              register={register("floor_id", {
                required: "Lantai harus diisi",
              })}
              setValue={setValue}
              model={floors ?? []}
              errors={errors}
            />
          ) : (
            <></>
          )}
          <InputText
            label="Kapasitas"
            type="number"
            name="capacity"
            register={register("capacity", {
              required: "Kapasitas harus diisi",
            })}
            min={1}
            setValue={setValue}
            errors={errors}
          />
          <span></span>
          {itemStatus === "success" ? (
            items?.map((item, index) => {
              const itemValue = watch(`items.${index}.item_id`);
              return (
                <div className="grid grid-cols-3 items-center" key={item.id}>
                  <InputToggle
                    label={item.name}
                    name={`items.${index}.item_id`}
                    id={`items.${index}.item_i d`}
                    value={item.id}
                    register={register(`items.${index}.item_id`)}
                    inputContainerClassName="col-span-2"
                    errors={errors}
                  />
                  {!!itemValue && <InputText
                    type="number"
                    inputClassName="input-sm"
                    placeholder="Jumlah barang"
                    min={1}
                    name={`items.${index}.quantity`}
                    id={`items.${index}.quantity`}
                    register={register(`items.${index}.quantity`, {
                      required: "Harus diisi",
                    })}
                    errors={errors}
                  />}
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className="modal-action flex-row-reverse justify-between">
            <div className="flex flex-row gap-4">
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
              >
                {selectedRoom ? "Ubah" : "Buat"}
              </button>
            </div>
            {selectedRoom && (
              <button
                className="btn !ml-0 btn-error"
                type="button"
                onClick={async () => {
                  await handleDeleteRoom();
                  return (
                    ref as React.RefObject<HTMLDialogElement>
                  ).current?.close();
                }}
              >
                Hapus
              </button>
            )}
          </div>
        </form>
      </>
    );
  }
);

export default RoomManageModal;
