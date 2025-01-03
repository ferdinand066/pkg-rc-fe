import { format } from "date-fns";
import { useState } from "react";
import InputText from "../components/forms/InputText";
import PageHeader from "../components/layout/PageHeader";
import RoomSchedule, {
  ScheduleSearchType,
} from "../components/pages/schedule/Schedule";
import useSchedule from "../hooks/general/use-schedule";
import useRoomSchedule from "../hooks/general/use-room-schedule";
import AlertContainer, { AlertData } from "../components/layout/AlertContainer";
import { getStatusValue } from "../lib/functions";

const initializeDate = () => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  return now;
};

const ScheduleIndexPage = () => {
  const currentDate = initializeDate();
  const [alert, setAlert] = useState<AlertData[]>([]);

  const [inputValue, setInputValue] = useState<ScheduleSearchType>({
    date: format(currentDate, "yyyy-MM-dd"),
    startTime: format(currentDate, "HH") + ":00",
    endTime: "23:59",
  });

  const [searchValue, setSearchValue] = useState<ScheduleSearchType>({
    date: format(currentDate, "yyyy-MM-dd"),
    startTime: format(currentDate, "HH") + ":00",
    endTime: "23:59",
  });

  const { data: floors, status: floorStatus } = useRoomSchedule();
  const { data: borrowedRooms, status: borrowedRoomStatus } =
    useSchedule(searchValue);

  return (
    <section className="flex flex-col h-full flex-1 gap-4 mb-24">
      <PageHeader pageName="Jadwal" />
      <div className="mx-6 flex flex-row items-end gap-4">
        <InputText
          type="date"
          min={currentDate.toISOString().split("T")[0]}
          label={"Tanggal Booking"}
          value={inputValue.date}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue((prev) => ({ ...prev, date: value }));
          }}
        />
        <InputText
          type="time"
          label={"Jam Awal Booking"}
          value={inputValue.startTime}
          onChange={(e) =>
            setInputValue((prev) => ({ ...prev, startTime: e.target.value }))
          }
        />
        <InputText
          type="time"
          label={"Jam Akhir Booking"}
          value={inputValue.endTime}
          onChange={(e) =>
            setInputValue((prev) => ({ ...prev, endTime: e.target.value }))
          }
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            const startHour = new Date(
              `${inputValue.date} ${inputValue.startTime}`
            ).getHours();
            const endHour = new Date(
              `${inputValue.date} ${inputValue.endTime}`
            ).getHours();

            // Validation
            if (endHour < startHour) {
              setAlert([
                {
                  message:
                    "Jam Akhir Booking tidak boleh kurang dari Jam Awal Booking!",
                },
              ]);
              return;
            }

            if (endHour - startHour < 1) {
              setAlert([
                {
                  message:
                    "Jam Akhir Booking harus memiliki jarak minimal 1 jam dari Jam Awal Booking!",
                },
              ]);
              return;
            }

            setAlert([]);
            setSearchValue(inputValue);
          }}
        >
          Cari
        </button>
      </div>
      <AlertContainer notification={alert} />
      <div className="mx-6">
        <RoomSchedule
          floors={floors!}
          borrowedRooms={borrowedRooms!}
          selectedRange={searchValue}
          status={getStatusValue(borrowedRoomStatus, floorStatus)}
        />
      </div>
    </section>
  );
};

export default ScheduleIndexPage;
