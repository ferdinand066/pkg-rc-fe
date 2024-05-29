import { isAfter, isSameDay, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InputCheckbox from "../../../components/forms/InputCheckbox";
import InputSelect from "../../../components/forms/InputSelect";
import InputText from "../../../components/forms/InputText";
import InputTextarea from "../../../components/forms/InputTextarea";
import AlertContainer from "../../../components/layout/AlertContainer";
import PageHeader from "../../../components/layout/PageHeader";
import useAuth from "../../../hooks/general/use-auth-user";
import { useGetOneBorrowedRoom } from "../../../hooks/general/use-borrowed-room";
import useManageBorrowedRoom from "../../../hooks/general/use-manage-borrowed-room";
import { useFetchRoom } from "../../../hooks/general/use-room";
import { ADMIN_ROLE_INT, BORROWED_STATUS } from "../../../lib/constants";
import { classJoin } from "../../../lib/functions";
import { GeneralData } from "../../../model/components/general-data";
import { RoomModel } from "../../../model/entities/room";

const agreementMap = [
  {
    text: 'menolak',
    style: 'text-error',
  },
  {
    text: 'menyetujui',
    style: 'text-success'
  }
]

const AGREEMENT_BORROW_COLOR = ['badge-error', 'badge-warning', 'badge-success']

const ManageBorrowedRoomPage = () => {
  const { id } = useParams();
  const { data: borrowedRoom } =
    useGetOneBorrowedRoom(id ?? "");

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

  const [initialize, _] = useState(false);
  const [ableToUpdate, setAbleToUpdate] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (roomStatus !== "success") return;
    if (initialize) return;
    if (borrowedRoom) return;
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
    if (borrowedRoom.borrowed_by_user_id === user.id) {
      setAbleToUpdate(true);
    }
  }, [user, borrowedRoom]);

  const watchRoomId = watch("room_id");

  const selectedRoom =
    ((rooms as RoomModel[]) ?? []).filter(
      (room) => room.id === watchRoomId
    )[0] ?? null;

  return (
    <section className="flex flex-col h-full flex-1 gap-4 mb-8 divide-y">
      <div className="flex flex-col">
        <PageHeader
          pageName={`${borrowedRoom ? "" : "Buat "}Proposal Pinjam Ruang`}
          action={borrowedRoom && borrowedRoom?.borrowed_status !== null ?
            <div className={classJoin("badge badge-outline px-4 py-3", AGREEMENT_BORROW_COLOR[borrowedRoom?.borrowed_status])}>{BORROWED_STATUS[borrowedRoom?.borrowed_status]}</div> : <></>
          }
        />
        <AlertContainer notification={(borrowedRoom?.borrowed_room_agreements ?? []).map((agreement) => ({
          message: <span>{agreement.created_by.name} telah <span className={agreementMap[agreement.agreement_status].style}>{ agreementMap[agreement.agreement_status].text }</span> permintaan ini.</span>
        }))}/>
        <form
          onSubmit={handleSubmit(handleManageBorrowedRoom)}
          className="grid grid-cols-6 mx-6 gap-x-4"
        >
          <div className="col-span-6">
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
          <div className="col-span-3">
            <InputText
              disabled={!ableToUpdate}
              label="Jam Mulai Pinjam"
              type="time"
              name="start_time"
              register={register("start_time", {
                required: "Jam mulai pinjam harus diisi",
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-3">
            <InputText
              disabled={!ableToUpdate}
              label="Jam Selesai Pinjam"
              type="time"
              name="end_time"
              register={register("end_time", {
                required: "Jam akhir harus diisi",
                validate: (endTime) => {
                  const startTime = getValues("start_time");
                  const startDateTime = new Date(`2000-01-01T${startTime}`);
                  const endDateTime = new Date(`2000-01-01T${endTime}`);

                  // Compare the end time with the start time
                  if (!isAfter(endDateTime, startDateTime)) {
                    return "Jam akhir harus setelah jam mulai";
                  }
                },
              })}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="col-span-4">
            {roomStatus === "success" ? (
              <InputSelect
                disabled={!ableToUpdate}
                label="Ruangan"
                name="room_id"
                register={register("room_id", {
                  required: "Ruangan harus diisi",
                })}
                setValue={setValue}
                model={(rooms as RoomModel[]) ?? []}
                // onChange={(e) => setSelectedId(e.target.value)}
                errors={errors}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="col-span-6">
            {roomStatus === "success" && selectedRoom ? (
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
            )}
          </div>
          <div className="col-span-6">
            <InputTextarea
              disabled={!ableToUpdate}
              label="Alasan"
              name="reason"
              id="reason"
              register={register("reason", { required: "Alasan harus diisi" })}
              setValue={setValue}
              placeholder="Alasan harus diisi"
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
          {user && user.role === ADMIN_ROLE_INT && !ableToUpdate && borrowedRoom && (borrowedRoom?.borrowed_room_agreements ?? []).filter((agreement) => agreement.created_by_user_id === (user.id as string)).length === 0 && (
            <div className="col-span-6 modal-action flex-row-reverse justify-between">
              <button className="btn btn-primary" onClick={async () => {
                await handleAcceptBorrowedRoom();
              }}>Setujui</button>
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
