import { format } from "date-fns";
import { useAtomValue } from "jotai";
import { padStart } from "lodash";
import { useState } from "react";
import InputText from "../components/forms/input-text";
import AlertContainer, { AlertData } from "../components/layout/alert-container";
import PageHeader from "../components/layout/page-header";
import RoomSchedule, {
  ScheduleSearchType,
} from "../components/pages/schedule/_schedule";
import useRoomSchedule from "../hooks/general/use-room-schedule";
import useSchedule from "../hooks/general/use-schedule";
import { classJoin, getStatusValue } from "../lib/functions";
import { appThemeAtom } from "../lib/state/state";

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
  const theme = useAtomValue(appThemeAtom);
  const isDarkTheme = theme === "dark";

  const [inputValue, setInputValue] = useState<ScheduleSearchType>({
    date: format(currentDate, "yyyy-MM-dd"),
    // start_time: format(currentDate, "HH") + ":00",
    start_time: "00:00",
    end_time: "23:59",
  });

  const [searchValue, setSearchValue] = useState<ScheduleSearchType>({
    date: format(currentDate, "yyyy-MM-dd"),
    // start_time: format(currentDate, "HH") + ":00",
    start_time: "00:00",
    end_time: "23:59",
  });

  const { data: floors, status: floorStatus } = useRoomSchedule();
  const { data: borrowedRooms, status: borrowedRoomStatus } =
    useSchedule(searchValue);

  const updateDate = (updateFn: (date: Date) => void) => {
    const { date } = searchValue;

    const originalDate = new Date(date);
    updateFn(originalDate);

    const formattedDate = format(originalDate, "yyyy-MM-dd");

    setInputValue((prev) => ({
      ...prev,
      date: formattedDate,
    }));
    setSearchValue((prev) => ({
      ...prev,
      date: formattedDate,
    }));
  };

  return (
    <section className="flex flex-col h-full flex-1 gap-4 mb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <PageHeader pageName="Jadwal" />
        <div className="px-6 w-full flex justify-end">
          <div className="join w-full sm:w-auto">
            <button
              onClick={() =>
                updateDate((date) => date.setDate(date.getDate() + 1))
              }
              className={classJoin("btn join-item flex-1", isDarkTheme ? "bg-neutral" : "bg-white")}
            >
              Next Day
            </button>
            <button
              onClick={() =>
                updateDate((date) => date.setDate(date.getDate() + 7))
              }
              className={classJoin("btn join-item flex-1", isDarkTheme ? "bg-neutral" : "bg-white")}
            >
              Next Week
            </button>
            <button
              onClick={() =>
                updateDate((date) => date.setMonth(date.getMonth() + 1))
              }
              className={classJoin("btn join-item flex-1", isDarkTheme ? "bg-neutral" : "bg-white")}
            >
              Next Month
            </button>
          </div>
        </div>
      </div>

      <div className="mx-6 flex flex-col md:flex-row items-end gap-4">
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
        {/* <InputText
          type="time"
          step={INPUT_TIME_STEP}
          label={"Jam Awal Booking"}
          value={inputValue.start_time}
          onChange={(e) =>
            setInputValue((prev) => ({ ...prev, start_time: e.target.value }))
          }
        />
        <InputText
          type="time"
          step={INPUT_TIME_STEP}
          label={"Jam Akhir Booking"}
          value={inputValue.end_time}
          onChange={(e) =>
            setInputValue((prev) => ({ ...prev, end_time: e.target.value }))
          }
        /> */}
        <button
          className="btn btn-primary w-full md:w-auto"
          type="button"
          onClick={() => {
            const startHour = new Date(
              `${inputValue.date} ${inputValue.start_time}`
            ).getHours();
            const endHour = new Date(
              `${inputValue.date} ${inputValue.end_time}`
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
              } else if (startHour >= 18) {
                adjustedStart = 18;
                adjustedEnd = 23; // Edge case for end of the day
              } else {
                adjustedStart = Math.max(
                  0,
                  midPoint - Math.floor(minInterval / 2)
                );
                adjustedEnd = Math.min(23, adjustedStart + minInterval);
              }

              const newValue = {
                ...inputValue,
                start_time: padStart(adjustedStart.toString(), 2, "0") + ":00",
                end_time: padStart(adjustedEnd.toString(), 2, "0") + ":00",
              };

              setInputValue(newValue);
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
