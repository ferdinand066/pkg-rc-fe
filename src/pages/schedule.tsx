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
import { padStart } from "lodash";
import { INPUT_TIME_STEP } from "../lib/constants";

const minInterval = 6;

const initializeDate = () => {
  const now = new Date();
  if (now.getHours() > 18) {
    now.setHours(18);
  }
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
          step={INPUT_TIME_STEP}
          label={"Jam Awal Booking"}
          value={inputValue.startTime}
          onChange={(e) =>
            setInputValue((prev) => ({ ...prev, startTime: e.target.value }))
          }
        />
        <InputText
          type="time"
          step={INPUT_TIME_STEP}
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

            if (endHour - startHour < minInterval) {
              let adjustedStart = startHour;
              let adjustedEnd = endHour;

              const midPoint = Math.floor((startHour + endHour) / 2);
        
              // Adjust start and end based on proximity
              if (startHour <= 6) {
                adjustedStart = 0;
                adjustedEnd = 6;

                console.log(adjustedStart, adjustedEnd);
              } else if (startHour >= 18) {
                adjustedStart = 18;
                adjustedEnd = 23; // Edge case for end of the day
              } else {
                adjustedStart = Math.max(0, midPoint - Math.floor(minInterval / 2));
                adjustedEnd = Math.min(23, adjustedStart + minInterval);

                console.log(adjustedStart, adjustedEnd);
              }

              const newValue = {
                ...inputValue,
                startTime: padStart(adjustedStart.toString(), 2, "0") + ":00", 
                endTime: padStart(adjustedEnd.toString(), 2, "0") + ":00",
              }

              console.log(newValue);

              setInputValue(newValue)
              setSearchValue(newValue);
            } else {
              setSearchValue(inputValue);
            }

            setAlert([]);
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
