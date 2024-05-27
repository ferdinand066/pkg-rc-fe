import { forwardRef, useEffect, useState } from "react";
import InputSelect from "../../../../components/forms/InputSelect";
import InputText from "../../../../components/forms/InputText";
import { useFetchItem } from "../../../../hooks/general/use-item";
import useManageBorrowedRoom from "../../../../hooks/general/use-manage-borrowed-room";
import { useFetchRoom } from "../../../../hooks/general/use-room";
import { BorrowedRoomModel } from "../../../../model/entities/borrowed-room";
import { RoomModel } from "../../../../model/entities/room";

type BorrowedRoomManageModalProps = {
  selectedBorrowedRoom: BorrowedRoomModel | undefined;
};

const BorrowedRoomManageModal = forwardRef<HTMLDialogElement, BorrowedRoomManageModalProps>(
  ({ selectedBorrowedRoom }, ref) => {
    const { data: rooms, status: roomStatus } = useFetchRoom({});
    const { data: items, status: itemStatus } = useFetchItem({});
    const [selectedData, setSelectedData] = useState(selectedBorrowedRoom);

    console.log(rooms);

    useEffect(() => {
      if (itemStatus !== 'success') return;
      if (!selectedBorrowedRoom){
        setSelectedData(undefined);
        return;
      }

      const map = new Map<string, number>();
      items?.forEach((item, index) => map.set(item.id as string, index))

      const newArray = new Array<string>(items?.length ?? 0);
      
      for (const key of (selectedBorrowedRoom?.item_id ?? [])) {
        const index = map.get(key);
        if (index !== undefined) {
          newArray[index] = key;
        }
      }

      const newData = {
        ...selectedBorrowedRoom,
        item_id: newArray
      }

      setSelectedData(newData);

    }, [itemStatus, selectedBorrowedRoom]);

    const {
      register,
      setValue,
      errors,
      handleManageBorrowedRoom,
      handleDeleteBorrowedRoom,
      handleSubmit,
    } = useManageBorrowedRoom(selectedData);

    return (
      <>
        <h3 className="font-bold text-lg">
          {!selectedBorrowedRoom ? "Buat Ruangan" : "Ubah Ruangan"}
        </h3>
        <form
          onSubmit={handleSubmit(handleManageBorrowedRoom)}
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
          {roomStatus === "success" ? (
            <InputSelect
              label="Ruangan"
              name="room_id"
              register={register("room_id", {
                required: "Ruangan harus diisi",
              })}
              setValue={setValue}
              model={(rooms as RoomModel[])?? []}
              errors={errors}
            />
          ) : (
            <></>
          )}
          {/* {itemStatus === "success" ? (
            <InputCheckbox
              label="Barang"
              name="item_id"
              id="item_id"
              checkboxOptions={(items ?? []).map((i: GeneralData, idx: number) => ({
                id: "" + i.id,
                label: i.name,
                name: `item_id.${idx}`,
                register: register(`item_id.${idx}`),
              }))}
              errors={errors}
            />
          ) : (
            <></>
          )} */}
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
                onClick={() =>
                  (ref as React.RefObject<HTMLDialogElement>).current?.close()
                }
              >
                {selectedBorrowedRoom ? "Ubah" : "Buat"}
              </button>
            </div>
            {selectedBorrowedRoom && (
              <button
                className="btn !ml-0 btn-error"
                type="button"
                onClick={async () => {
                  await handleDeleteBorrowedRoom();
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

export default BorrowedRoomManageModal;
