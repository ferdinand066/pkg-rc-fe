import { forwardRef } from "react";
import InputSelect from "../../../../components/forms/input-select";
import InputText from "../../../../components/forms/input-text";
import useManageRoom from "../../../../hooks/admin/form/use-manage-room";
import { useFetchFloor } from "../../../../hooks/general/use-floor";
import { RoomModel } from "../../../../model/entities/room";

type RoomManageModalProps = {
  selectedRoom: RoomModel | undefined;
};

const RoomManageModal = forwardRef<HTMLDialogElement, RoomManageModalProps>(
  ({ selectedRoom }, ref) => {
    const { data: floors, status: floorStatus } = useFetchFloor({
      order_by: 'created_at',
      data_order: 'asc',
    });

    const {
      register,
      setValue,
      errors,
      handleManageRoom,
      handleDeleteRoom,
      handleSubmit,
    } = useManageRoom(selectedRoom);

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
