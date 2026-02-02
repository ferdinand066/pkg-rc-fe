import { isAfter, isSameDay, parseISO } from "date-fns";
import { forwardRef } from "react";
import InputCheckbox from "../../../../components/forms/input-checkbox";
import InputSelect from "../../../../components/forms/input-select";
import InputText from "../../../../components/forms/input-text";
import useFilterBorrowedRoom from "../../../../hooks/general/use-filter-borrowed-room";
import { GeneralData } from "../../../../model/components/general-data";
import { RoomModel } from "../../../../model/entities/room";

const borrowedRoomStatuses: GeneralData[] = [
  {
    id: 1,
    name: "Pending",
  },
  {
    id: 2,
    name: "Accepted",
  },
];

const FilterBorrowedRoomModal = forwardRef<
  HTMLDialogElement,
  object
>((_, ref) => {
  const {
    register,
    setValue,
    errors,
    handleSubmit,
    watch,
    getValues,

    handleFilterBorrowedRoom,
    floors,
    floorStatus,
    rooms,
    roomStatus,
    reset,
    resetFilter,
  } = useFilterBorrowedRoom();
  return (
    <>
      <h3 className="font-bold text-lg">Filter Booking Ruangan</h3>
      <form
        onSubmit={handleSubmit(async (data) => {
          await handleFilterBorrowedRoom(data);
          (ref as React.RefObject<HTMLDialogElement>).current?.close();
        })}
        className="flex flex-col gap-2"
      >
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-6 sm:col-span-3">
            <InputText
              label="Booking dari"
              type="date"
              name="start_date"
              register={register("start_date")}
              setValue={setValue}
              errors={errors}
            // isLoading={borrowedRoomStatus === "pending" && !!id}
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <InputText
              label="Booking sampai"
              type="date"
              name="end_date"
              register={register("end_date", {
                validate: (date) => {
                  if (!date) return true;

                  const selectedDate = parseISO(date);
                  const previous = getValues("start_date");
                  if (!previous) return true;

                  const previousValue = parseISO(previous);

                  if (
                    !isAfter(selectedDate, previousValue) &&
                    !isSameDay(selectedDate, previousValue)
                  ) {
                    return "Tanggal harus lebih besar dari tanggal awal";
                  }
                  return true;
                },
              })}
              setValue={setValue}
              errors={errors}
            // isLoading={borrowedRoomStatus === "pending" && !!id}
            />
          </div>
        </div>
        <InputCheckbox
          label="Status"
          name="status"
          id="status"
          checkboxOptions={borrowedRoomStatuses.map(
            (i: GeneralData, idx: number) => ({
              id: "" + i.id,
              label: i.name,
              name: `status.${idx}`,
              register: register(`status.${idx}`),
            })
          )}
          errors={errors}
        />

        {floorStatus === "success" && (
          <InputSelect
            label="Lantai"
            name="floor_id"
            value={watch("floor_id") ?? ""}
            register={register("floor_id")}
            setValue={setValue}
            model={floors ?? []}
          // errors={errors}
          />
        )}

        {roomStatus === "success" && (
          <InputCheckbox
            label="Ruangan"
            name="room_id"
            id="room_id"
            checkboxOptions={((rooms as RoomModel[]) ?? []).map(
              (i: GeneralData, idx: number) => ({
                id: "" + i.id,
                label: i.name,
                name: `room_id.${idx}`,
                register: register(`room_id.${idx}`),
              })
            )}
          />
        )}
        <span></span>
        <div className="modal-action flex-row-reverse justify-between">
          <div className="flex flex-row gap-4">
            <button
              className="btn bg-base-100 hover:bg-gray-200 border-none"
              type="button"
              onClick={() => {
                reset();
                return (ref as React.RefObject<HTMLDialogElement>).current?.close();
              }}
            >
              Tutup
            </button>
            <button className="btn btn-primary" type="submit">
              {"Saring"}
            </button>
          </div>
          <button
            className="btn !ml-0 btn-error"
            type="button"
            onClick={async () => {
              resetFilter();
              return (
                ref as React.RefObject<HTMLDialogElement>
              ).current?.close();
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </>
  );
});

export default FilterBorrowedRoomModal;
