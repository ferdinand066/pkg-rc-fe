import { useNavigate, useParams } from "react-router-dom";
import InputSelect from "../../../components/forms/InputSelect";
import InputText from "../../../components/forms/InputText";
import PageHeader from "../../../components/layout/PageHeader";
import { useFetchRoom } from "../../../hooks/general/use-room";
import { RoomModel } from "../../../model/entities/room";
import { useEffect, useState } from "react";
import InputCheckbox from "../../../components/forms/InputCheckbox";
import { GeneralData } from "../../../model/components/general-data";
import useManageBorrowedRoom from "../../../hooks/general/use-manage-borrowed-room";
import InputTextarea from "../../../components/forms/InputTextarea";
import { isAfter, isSameDay, parseISO } from "date-fns";
import { useGetOneBorrowedRoom } from "../../../hooks/general/use-borrowed-room";

const ManageBorrowedRoomPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { data: borrowedRoom, status: borrowedRoomStatus } =
    useGetOneBorrowedRoom(id ?? "");

  const { data: rooms, status: roomStatus } = useFetchRoom({});
  const {
    register,
    setValue,
    errors,
    handleManageBorrowedRoom,
    handleDeleteBorrowedRoom,
    handleSubmit,
    watch,
    getValues,
  } = useManageBorrowedRoom(borrowedRoom);

  const [initialize, setInitialize] = useState(false);

  useEffect(() => {
    if (roomStatus !== "success") return;
    if (initialize) return;
    if (borrowedRoom) return;
    const roomData = rooms as RoomModel[];
    setValue("room_id", roomData[0].id as string);
  }, [initialize, roomStatus]);

  const watchRoomId = watch("room_id");

  const selectedRoom =
    ((rooms as RoomModel[]) ?? []).filter(
      (room) => room.id === watchRoomId
    )[0] ?? null;

  return (
    <section className="flex flex-col h-full flex-1 gap-4 mb-8">
      <PageHeader
        pageName={`${borrowedRoom ? "Ubah" : "Buat"} Proposal Pinjam Ruang`}
      />
      <form
        onSubmit={handleSubmit(handleManageBorrowedRoom)}
        className="grid grid-cols-6 mx-6 gap-x-4"
      >
        <div className="col-span-6">
          <InputText
            label="Tanggal Pinjam Ruangan"
            type="date"
            name="borrowed_date"
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
            label="Alasan"
            name="reason"
            id="reason"
            register={register("reason", { required: "Alasan harus diisi" })}
            setValue={setValue}
            placeholder="Alasan harus diisi"
            errors={errors}
          />
        </div>
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
              onClick={async () => {
                await handleDeleteBorrowedRoom();
                navigate('/user/room-request');
              }}
            >
              Hapus
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ManageBorrowedRoomPage;
