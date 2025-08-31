import { isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import InputSelect from "../../../components/forms/InputSelect";
import InputText from "../../../components/forms/InputText";
import InputTextarea from "../../../components/forms/InputTextarea";
import InputToggle from "../../../components/forms/InputToggle";
import PageHeader from "../../../components/layout/PageHeader";
import useManageRecurringBorrowRoom from "../../../hooks/general/use-manage-recurring-borrow-room";
import { useFetchRoom } from "../../../hooks/general/use-room";
import { INPUT_TIME_STEP } from "../../../lib/constants";
import { RoomModel } from "../../../model/entities/room";

const RECURRING_OPTIONS = [
  {
    id: "daily",
    name: "Harian",
  },
  {
    id: "weekly",
    name: "Mingguan",
  },
  {
    id: "monthly",
    name: "Bulanan",
  },
];

const ManageRecurringRoomPage = () => {
  const { data: rooms, status: roomStatus } = useFetchRoom({}, {
    order_by: "name",
    data_order: "asc",
  }, false);

  const {
    register,
    setValue,
    errors,
    handleManageBorrowedRoom,
    handleSubmit,
    watch,
    getValues,
  } = useManageRecurringBorrowRoom();

  const watchRoomId = watch('room_id');

  const [initialize, setInitialized] = useState(false);

  useEffect(() => {
    if (roomStatus !== "success") return;
    if (initialize) return;
    setInitialized(true);

    const roomData = rooms as RoomModel[];
    setValue("room_id", roomData[0].id as string);
  }, [initialize, roomStatus]);

  return (
    <section className="flex flex-col h-full flex-1 gap-4 mb-8 divide-y">
      <div className="flex flex-col">
        <PageHeader
          pageName={`Buat Proposal Pinjam Ruang Berulang`}
        />
        <form
          onSubmit={handleSubmit(handleManageBorrowedRoom)}
          className="grid grid-cols-6 gap-4 mx-6"
        >
          <div className="col-span-6 sm:col-span-4">
            <InputText
              label="Nama Kegiatan"
              type="text"
              name="event_name"
              placeholder="Contoh: Acara Natal"
              register={register("event_name", {
                required: "Nama kegiatan harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputSelect
              label="Berulang Setiap"
              name="recurring"
              register={register("recurring", {
                required: "Jangka berulang harus diisi",
              })}
              setValue={setValue}
              model={
                RECURRING_OPTIONS.map((option) => ({
                  id: option.id,
                  name: option.name,
                }))
              }
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <InputText
              label="Nama PIC"
              type="text"
              name="pic_name"
              placeholder="Tuliskan nama anda"
              register={register("pic_name", {
                required: "Nama PIC harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <InputText
              label="No. Telp PIC"
              type="text"
              name="pic_phone_number"
              placeholder="Format: 08....."
              register={register("pic_phone_number", {
                required: "No. Telp PIC harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-1">
            <InputText
              label="Mulai Pinjam"
              type="date"
              name="start_borrowed_date"
              register={register("start_borrowed_date", {
                required: "Tanggal mulai harus diisi",
                validate: (date) => {
                  const selectedDate = parseISO(date);
                  const today = new Date();

                  if (
                    !isAfter(selectedDate, today) &&
                    !isSameDay(selectedDate, today)
                  ) {
                    return "Tanggal peminjaman awal harus setelah hari ini";
                  }
                  return true;
                },
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-1">
            <InputText
              label="Selesai Pinjam"
              type="date"
              name="end_borrowed_date"
              register={register("end_borrowed_date", {
                required: "Tanggal peminjaman akhir harus diisi",
                validate: (date) => {
                  const selectedDate = parseISO(date);
                  const today = new Date();

                  if (
                    !isAfter(selectedDate, today) &&
                    !isSameDay(selectedDate, today)
                  ) {
                    return "Tanggal peminjaman akhir harus setelah hari ini";
                  }

                  const startBorrowedDate = getValues("start_borrowed_date");
                  if (isBefore(selectedDate, startBorrowedDate)) {
                    return "Tanggal peminjaman akhir harus setelah tanggal mulai peminjaman";
                  }

                  return true;
                },
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Kapasitas"
              type="number"
              name="capacity"
              register={register("capacity", {
                required: "Kapasitas harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-4">
            <InputSelect
              label="Ruangan"
              name="room_id"
              register={register("room_id", {
                required: "Ruangan harus diisi",
              })}
              setValue={setValue}
              model={
                ((rooms ?? []) as RoomModel[]).map((room) => ({
                  id: room.id,
                  name: room.name + " (" + room.floor.name + ")",
                })) ?? []
              }
              errors={errors}
              isLoading={roomStatus === "pending"}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Jam Mulai Pinjam"
              type="time"
              step={INPUT_TIME_STEP}
              name="start_borrowing_time"
              register={register("start_borrowing_time", {
                required: "Jam mulai pinjam harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Jam Mulai Acara"
              type="time"
              step={INPUT_TIME_STEP}
              name="start_event_time"
              register={register("start_event_time", {
                required: "Jam mulai acara harus diisi",
                validate: (endTime) => {
                  const startTime = getValues("start_borrowing_time");
                  const startDateTime = new Date(`2000-01-01T${startTime}`);
                  const endDateTime = new Date(`2000-01-01T${endTime}`);

                  // Compare the end time with the start time
                  if (isBefore(endDateTime, startDateTime)) {
                    return "Jam mulai harus setelah jam mulai pinjam";
                  }
                },
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Jam Selesai Pinjam"
              type="time"
              step={INPUT_TIME_STEP}
              name="end_event_time"
              register={register("end_event_time", {
                required: "Jam akhir harus diisi",
                validate: (endTime) => {
                  const startTime = getValues("start_event_time");
                  const startDateTime = new Date(`2000-01-01T${startTime}`);
                  const endDateTime = new Date(`2000-01-01T${endTime}`);

                  // Compare the end time with the start time
                  if (!isAfter(endDateTime, startDateTime)) {
                    return "Jam akhir event harus setelah jam mulai event";
                  }
                },
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-4">
            {roomStatus === "pending" ? <RoomItemLoading /> : watchRoomId && rooms &&
              (rooms as RoomModel[]).find((room) => room.id === watchRoomId)?.room_items?.map((item, index) => {
                const itemValue = watch(`items.${index}.item_id`);
                return (
                  <div className="grid grid-cols-3 items-center" key={item.id}>
                    <InputToggle
                      label={item.item.name}
                      name={`items.${index}.item_id`}
                      id={`items.${index}.item_id`}
                      value={item.item_id}
                      register={register(`items.${index}.item_id`)}
                      inputContainerClassName="col-span-2"
                      errors={errors}
                    />
                    {!!itemValue && (
                      <InputText
                        type="number"
                        inputClassName="input-sm"
                        placeholder="Jumlah barang"
                        min={1}
                        name={`items.${index}.quantity`}
                        id={`items.${index}.quantity`}
                        register={register(`items.${index}.quantity`, {
                          required: "Harus diisi",
                        })}
                        setValue={setValue}
                        errors={errors}
                      />
                    )}
                  </div>
                );
              })}
          </div>
          <div className="col-span-6">
            <InputTextarea
              label="Keterangan"
              name="description"
              id="description"
              register={register("description", {
                required: "Keterangan harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 modal-action flex-row-reverse justify-between">
            <div className="flex flex-row gap-4">
              <button className="btn btn-neutral" type="button">
                Tutup
              </button>
              <button className="btn btn-primary" type="submit">
                Buat
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* {user && user.role === ADMIN_ROLE_INT && (
        <div className="flex flex-col">
          <PageHeader pageName={`Persetujuan Pinjam Ruang`} />
          <form action="" className="grid grid-cols-6 mx-6 gap-x-4"></form>
        </div>
      )} */}
    </section>
  );
};

const RoomItemLoading = () => {
  return <div className="flex flex-row gap-4 px-1 items-center">
    <div className="bg-base-300 min-w-12 animate-pulse rounded-full h-7"></div>
    <div className="bg-base-300 min-w-32 animate-pulse rounded-full h-6"></div>
  </div>
}

export default ManageRecurringRoomPage;
