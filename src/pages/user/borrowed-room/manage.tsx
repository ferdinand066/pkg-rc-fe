import { isAfter, isSameDay, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InputSelect from "../../../components/forms/InputSelect";
import InputText from "../../../components/forms/InputText";
import InputTextarea from "../../../components/forms/InputTextarea";
import InputToggle from "../../../components/forms/InputToggle";
import AlertContainer from "../../../components/layout/AlertContainer";
import PageHeader from "../../../components/layout/PageHeader";
import useAuth from "../../../hooks/general/use-auth-user";
import { useGetOneBorrowedRoom } from "../../../hooks/general/use-borrowed-room";
import useManageBorrowedRoom from "../../../hooks/general/use-manage-borrowed-room";
import { useFetchRoom, useGetRoomAvailability } from "../../../hooks/general/use-room";
import { ADMIN_ROLE_INT, BORROWED_STATUS } from "../../../lib/constants";
import { classJoin } from "../../../lib/functions";
import { BorrowedRoomModel } from "../../../model/entities/borrowed-room";
import { RoomModel } from "../../../model/entities/room";

const agreementMap = [
  {
    text: "menolak",
    style: "text-error",
  },
  {
    text: "menyetujui",
    style: "text-success",
  },
];

const AGREEMENT_BORROW_COLOR = [
  "badge-error",
  "badge-warning",
  "badge-success",
];

const fetchNotification = (
  borrowedRoom: BorrowedRoomModel | null | undefined
) => {
  if (!borrowedRoom) return [];
  const processedAgreements = (
    borrowedRoom?.borrowed_room_agreements ?? []
  ).map((agreement) => ({
    message: (
      <span>
        {agreement.created_by.name} telah{" "}
        <span className={agreementMap[agreement.agreement_status].style}>
          {agreementMap[agreement.agreement_status].text}
        </span>{" "}
        permintaan ini.
      </span>
    ),
  }));

  if ((borrowedRoom.pending_users ?? []).length === 0)
    return processedAgreements;

  const pendingAgreements = {
    message: (
      <span>
        <span className="text-warning">Menunggu konfirmasi</span> dari{" "}
        {borrowedRoom.pending_users?.map((user) => user.name).join(", ")}
      </span>
    ),
  };

  return [...processedAgreements, pendingAgreements];
};

const ManageBorrowedRoomPage = () => {
  const { id } = useParams();
  const { data: borrowedRoom } = useGetOneBorrowedRoom(id ?? "");

  const { data: rooms, status: roomStatus } = useFetchRoom({});

  const {
    register,
    setValue,
    errors,
    handleManageBorrowedRoom,
    handleDeleteBorrowedRoom,
    handleAcceptBorrowedRoom,
    handleDeclineBorrowedRoom,
    handleSubmit,
    watch,
    getValues,
  } = useManageBorrowedRoom(borrowedRoom);

  const watchRoomId = watch('room_id');
  const watchBorrowedDate = watch('borrowed_date');

  const [initialize, setInitialized] = useState(false);
  const [ableToUpdate, setAbleToUpdate] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (roomStatus !== "success") return;
    if (initialize) return;
    if (borrowedRoom) return;
    setInitialized(true);

    const roomData = rooms as RoomModel[];
    setValue("room_id", roomData[0].id as string);
  }, [initialize, roomStatus]);

  useEffect(() => {
    if (!id) {
      setAbleToUpdate(true);
      return;
    }

    if (!borrowedRoom) return;
    if (!user) return;
    if (borrowedRoom.borrowed_status === 2) return;
    if (borrowedRoom.borrowed_by_user_id === user.id) {
      setAbleToUpdate(true);
    }
  }, [user, borrowedRoom]);

  const { data: slots, status: slotStatus } = useGetRoomAvailability(watchRoomId, {
    borrowing_date: watchBorrowedDate,
    borrowed_room_id: id,
    check_schedule: (borrowedRoom?.borrowed_status ?? 1) === 1,
  }); 

  return (
    <section className="flex flex-col h-full flex-1 gap-4 mb-8 divide-y">
      <div className="flex flex-col">
        <PageHeader
          pageName={`${borrowedRoom ? "" : "Buat "}Proposal Pinjam Ruang`}
          action={
            borrowedRoom && borrowedRoom?.borrowed_status !== null ? (
              <div
                className={classJoin(
                  "badge badge-outline px-4 py-3",
                  AGREEMENT_BORROW_COLOR[borrowedRoom?.borrowed_status]
                )}
              >
                {BORROWED_STATUS[borrowedRoom?.borrowed_status]}
              </div>
            ) : (
              <></>
            )
          }
        />
        <AlertContainer notification={fetchNotification(borrowedRoom)} />
        <form
          onSubmit={handleSubmit(handleManageBorrowedRoom)}
          className="grid grid-cols-6 gap-4 mx-6"
        >
          <div className="col-span-6 sm:col-span-5">
            <InputText
              label="Nama Kegiatan"
              type="text"
              name="event_name"
              placeholder="Contoh: Acara Natal"
              disabled={!ableToUpdate}
              register={register("event_name", {
                required: "Nama kegiatan harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Nama PIC"
              type="text"
              name="pic_name"
              placeholder="Tuliskan nama anda"
              disabled={!ableToUpdate}
              register={register("pic_name", {
                required: "Nama PIC harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="No. Telp PIC"
              type="text"
              name="pic_phone_number"
              placeholder="Format: 08....."
              disabled={!ableToUpdate}
              register={register("pic_phone_number", {
                required: "No. Telp PIC harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              label="Tanggal Pinjam Ruangan"
              type="date"
              name="borrowed_date"
              disabled={!ableToUpdate}
              register={register("borrowed_date", {
                required: "Tanggal peminjaman harus diisi",
                validate: (date) => {
                  const selectedDate = parseISO(date);
                  const today = new Date();

                  if (
                    !isAfter(selectedDate, today) &&
                    !isSameDay(selectedDate, today)
                  ) {
                    return "Tanggal peminjaman harus setelah hari ini";
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
              disabled={!ableToUpdate}
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
            {roomStatus === "success" ? (
              <InputSelect
                disabled={!ableToUpdate}
                label="Ruangan"
                name="room_id"
                register={register("room_id", {
                  required: "Ruangan harus diisi",
                })}
                setValue={setValue}
                model={
                  (rooms as RoomModel[]).map((room) => ({
                    id: room.id,
                    name: room.name + " (" + room.floor.name + ")",
                  })) ?? []
                }
                errors={errors}
                description={slotStatus === "success" ? <div className="flex flex-col text-sm">
                  <span>Tersedia pada</span>
                  <ul>
                  {
                    (slots ?? []).map((slot, index) => <li className="ml-2" key={index}>{slot}</li>)
                  }
                  </ul>
                </div> : <></>}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="col-span-6 sm:col-span-2">
            <InputText
              disabled={borrowedRoom?.borrowed_status === 2}
              label="Jam Mulai Pinjam"
              type="time"
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
              disabled={!ableToUpdate}
              label="Jam Mulai Acara"
              type="time"
              name="start_event_time"
              register={register("start_event_time", {
                required: "Jam mulai acara harus diisi",
                validate: (endTime) => {
                  const startTime = getValues("start_borrowing_time");
                  const startDateTime = new Date(`2000-01-01T${startTime}`);
                  const endDateTime = new Date(`2000-01-01T${endTime}`);

                  // Compare the end time with the start time
                  if (!isAfter(endDateTime, startDateTime)) {
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
              disabled={!ableToUpdate}
              label="Jam Selesai Pinjam"
              type="time"
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
            {/* {roomStatus === "success" && selectedRoom ? (
              <InputCheckbox
                disabled={!ableToUpdate}
                label="Barang"
                name="item_id"
                id="item_id"
                checkboxOptions={(selectedRoom.room_items ?? [])
                  .map((item) => item.item)
                  .map((i: GeneralData, idx: number) => ({
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
            {watchRoomId && rooms &&
              (rooms as RoomModel[]).find((room) => room.id === watchRoomId)?.room_items?.map((item, index) => {
                const itemValue = watch(`items.${index}.item_id`);
                return (
                  <div className="grid grid-cols-3 items-center" key={item.id}>
                    <InputToggle
                      disabled={!ableToUpdate}
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
                        disabled={!ableToUpdate}
                        inputClassName="input-sm"
                        placeholder="Jumlah barang"
                        min={1}
                        name={`items.${index}.quantity`}
                        id={`items.${index}.quantity`}
                        register={register(`items.${index}.quantity`, {
                          required: "Harus diisi",
                        })}
                        errors={errors}
                      />
                    )}
                  </div>
                );
              })}
          </div>
          <div className="col-span-6">
            <InputTextarea
              disabled={!ableToUpdate}
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
          {ableToUpdate && (
            <div className="col-span-6 modal-action flex-row-reverse justify-between">
              <div className="flex flex-row gap-4">
                <button className="btn btn-neutral" type="button">
                  Tutup
                </button>
                <button className="btn btn-primary" type="submit">
                  {borrowedRoom ? "Ubah" : "Buat"}
                </button>
              </div>
              {borrowedRoom && (
                <button
                  className="btn !ml-0 btn-error"
                  type="button"
                  onClick={() => handleDeleteBorrowedRoom()}
                >
                  Hapus
                </button>
              )}
            </div>
          )}
          {user &&
            user.role === ADMIN_ROLE_INT &&
            !ableToUpdate &&
            borrowedRoom &&
            (borrowedRoom?.borrowed_room_agreements ?? []).filter(
              (agreement) =>
                agreement.created_by_user_id === (user.id as string)
            ).length === 0 && (
              <div className="col-span-6 modal-action flex-row-reverse justify-between">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit(
                    async () => await handleAcceptBorrowedRoom()
                  )}
                >
                  Setujui
                </button>
                <button
                  className="btn !ml-0 btn-error"
                  type="button"
                  onClick={async () => {
                    await handleDeclineBorrowedRoom();
                  }}
                >
                  Tolak
                </button>
              </div>
            )}
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

export default ManageBorrowedRoomPage;
