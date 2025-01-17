import { useAtomValue } from "jotai";
import range from "lodash/range";
import { Fragment } from "react/jsx-runtime";
import useAuth from "../../../hooks/general/use-auth-user";
import {
  ADMIN_ROLE_INT,
  BORROWED_STATUS_PENDING_INT,
} from "../../../lib/constants";
import { classJoin } from "../../../lib/functions";
import { appThemeAtom } from "../../../lib/state/state";
import { BorrowedRoomModel } from "../../../model/entities/borrowed-room";
import { FloorModel } from "../../../model/entities/room";
import { useEffect, useRef, useState } from "react";
// import {
//   controller,
//   differenceInMinutes,
//   formatTo12Hour,
//   generateMinuteBasedOnIndex,
//   HOUR_DIVIDER,
//   RoomScheduleType,
//   SLOT_PER_HOUR,
//   TOTAL_HOUR,
// } from "./controller";
// import { STATUS_TRANSACTION_DETAIL_ACTIVE } from "~/utils/constants";
// import { classJoin } from "~/utils/functions";

export type ScheduleSearchType = {
  date: string;
  start_time: string;
  end_time: string;
};

type LegentLabelType = {
  name: string;
  labelColor: string;
};

export type RoomScheduleType = {
  floors: FloorModel[];
  borrowedRooms: BorrowedRoomModel[];
  selectedRange: ScheduleSearchType;
  status: "success" | "error" | "loading";
};

export const TOTAL_HOUR = 24;
export const HOUR_DIVIDER = 30;
export const SLOT_PER_HOUR = 60 / HOUR_DIVIDER;

// export const formatTo12Hour = (hour: number) => {
//   const suffix = hour >= 12 ? "PM" : "AM";
//   const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
//   return `${formattedHour} ${suffix}`;
// };

export const generateMinuteBasedOnIndex = (index: number) => {
  const updatedIndex =
    (index % SLOT_PER_HOUR === 0 ? SLOT_PER_HOUR : index % SLOT_PER_HOUR) - 1;
  const minutes = updatedIndex * HOUR_DIVIDER;

  return minutes.toString().padStart(2, "0");
};

export const differenceInMinutes = (startTime: string, endTime: string) => {
  // Create Date objects for a fixed date (e.g., 1970-01-01)
  const date1 = new Date(`1970-01-01T${startTime}Z`);
  const date2 = new Date(`1970-01-01T${endTime}Z`);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = date2.getTime() - date1.getTime();

  // Convert milliseconds to minutes
  return diffInMilliseconds / (1000 * 60);
};

const getTimeBasedOnIndex = (startHour: number, index: number) => {
  index--;
  const hourOffset = Math.floor(index / SLOT_PER_HOUR); // How many hours ahead from the startHour
  const minuteOffset = (index % SLOT_PER_HOUR) * HOUR_DIVIDER; // Minutes into the hour

  const clickedHour = startHour + hourOffset;
  const clickedMinutes = minuteOffset;

  return `${clickedHour.toString().padStart(2, "0")}:${clickedMinutes
    .toString()
    .padStart(2, "0")}:00`;
};

const LegendLabel = ({ name, labelColor }: LegentLabelType) => {
  return (
    <div className="flex flex-row gap-1 items-center">
      <span className={classJoin(labelColor, "size-5 border rounded")} />
      <span>{name}</span>
    </div>
  );
};

const RoomSchedule = ({
  floors,
  borrowedRooms,
  selectedRange,
  status,
}: //   activeArea,
//   timeClickedCallback,
//   selectedRow,
//   containerClass,
//   isBookedDataClickable = false,
RoomScheduleType) => {
  const startHour = new Date(
    `${selectedRange.date} ${selectedRange.start_time}`
  ).getHours();
  let endHour =
    new Date(`${selectedRange.date} ${selectedRange.end_time}`).getHours() + 1;
  // if (endHour === 0) {
  //   endHour = 12;
  // }

  const theme = useAtomValue(appThemeAtom);
  const isDarkTheme = theme === "dark";
  const { user } = useAuth();

  //   const startHour = 5;

  //   const {
  //     handleClick,
  //     startHour,
  //     formattedTransactionRooms: transactionRooms,
  //     getTimeBasedOnIndex,
  //     handleOnBookSelectedRoom,
  //   } = controller(activeArea);

  const checkTransactionExists = (roomId: string, time: string) => {
    if ((borrowedRooms ?? []).length === 0) return false;
    return (borrowedRooms ?? []).find((borrowedRoom) => {
      if (borrowedRoom.room.id !== roomId) return false;

      const startBorrowingTime = borrowedRoom.start_borrowing_time + ":00";
      if (startBorrowingTime === time) return true;

      const startTime = selectedRange.start_time + ":00";
      if (time === startTime && startBorrowingTime < startTime + ":00") return true;

      return false;
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-end p-4 gap-4">
        {/* {
          timeClickedCallback && <LegendLabel name="Selected" labelColor="bg-blue-300"/>
        } */}
        <LegendLabel name="Telah dibook" labelColor="bg-yellow-300" />
        <LegendLabel name="Disetujui" labelColor="bg-green-300" />
      </div>
      <div id="table-container" className={classJoin("overflow-auto scrollbar-hide", "")}>
        <table className="table table-sm table-pin-rows table-pin-cols">
          <thead className="border">
            <tr className="border">
              <th className="border w-32 h-8 z-30 min-w-32"></th>
              {range(startHour, endHour).map((index) => (
                <td
                  key={index}
                  className="border border-l-4"
                  colSpan={SLOT_PER_HOUR}
                >
                  {`${index}:00`}
                </td>
              ))}
            </tr>
            <tr className="top-8 border">
              <th className="border w-32 h-8 z-30 min-w-32"></th>
              {range(1, SLOT_PER_HOUR * (endHour - startHour) + 1).map(
                (index) => {
                  const boldLeft = (index - 1) % SLOT_PER_HOUR === 0;

                  return (
                    <td
                      key={index}
                      className={classJoin(
                        "border w-8 h-8",
                        boldLeft ? "border-l-4" : ""
                      )}
                    >
                      {generateMinuteBasedOnIndex(index)}
                    </td>
                  );
                }
              )}
            </tr>
          </thead>
          <tbody>
            {status === "success" ? (
              floors.map((floor) => {
                return (
                  <Fragment key={floor.id}>
                    <tr className="border">
                      <th
                        className={classJoin(
                          !isDarkTheme
                            ? "bg-neutral-700 text-white"
                            : "bg-transparent text-gray-300"
                        )}
                      >
                        <span className="w-32 inline-block">{floor.name}</span>
                      </th>
                      <td
                        className={classJoin(
                          !isDarkTheme
                            ? "bg-neutral-700"
                            : "dark:bg-transparent"
                        )}
                        colSpan={(24 - startHour) * SLOT_PER_HOUR}
                      ></td>
                    </tr>
                    {floor.rooms
                      .sort((a, b) => (a.name < b.name ? -1 : 1))
                      .map((room, index) => {
                        let indexToSkip = 0;
                        let defaultBackground =
                          index % 2
                            ? !isDarkTheme
                              ? "bg-white"
                              : "dark:bg-base-100"
                            : !isDarkTheme
                            ? "bg-gray-100"
                            : "dark:bg-base-300";

                        return (
                          <tr key={index} className="border">
                            <th
                              className={classJoin("border", defaultBackground)}
                            >
                              <span className="w-32 inline-block">
                                {room.name}
                              </span>
                            </th>
                            {range(
                              1,
                              SLOT_PER_HOUR * (endHour - startHour) + 1
                            ).map((index) => {
                              if (indexToSkip > 0) {
                                // Skip this iteration if indexToSkip is greater than 0
                                indexToSkip--;
                                return null;
                              }
                              //   const res = handleClick(room, index);
                              const minutes = getTimeBasedOnIndex(
                                startHour,
                                index
                              );

                              var columnColor = classJoin(
                                isDarkTheme
                                  ? "hover:bg-neutral-600"
                                  : "hover:bg-gray-200",
                                defaultBackground
                              );
                              const transactionDetailRoom =
                                checkTransactionExists(
                                  room.id as string,
                                  minutes
                                );
                              var colSpan = 1;

                              if (!!transactionDetailRoom) {
                                if (
                                  transactionDetailRoom.borrowed_status ===
                                  BORROWED_STATUS_PENDING_INT
                                ) {
                                  columnColor =
                                    "bg-yellow-300 hover:bg-yellow-500 transition-all";
                                } else {
                                  columnColor =
                                    "bg-green-300 hover:bg-green-500 transition-all";
                                }

                                if (isDarkTheme) {
                                  columnColor = classJoin(columnColor, "text-black font-semibold")
                                }
                                colSpan = Math.ceil(
                                  differenceInMinutes(
                                    minutes,
                                    transactionDetailRoom.end_event_time.toString()
                                  ) / HOUR_DIVIDER
                                );
                                if (
                                  transactionDetailRoom.end_event_time.toString() ===
                                  "23:59:00"
                                ) {
                                  colSpan++;
                                }
                                indexToSkip = colSpan - 1;
                              }
                              //   else if (
                              //     selectedRow?.room.id === room.id &&
                              //     selectedRow.time === res.time
                              //   ) {
                              //     columnColor = "bg-blue-300 hover:bg-blue-500";
                              //   }

                              const boldLeft =
                                (index - 1) % SLOT_PER_HOUR === 0;

                              return (
                                <ScheduleTableDataComponent
                                  key={index}
                                  transactionDetailRoom={transactionDetailRoom}
                                  boldLeft={boldLeft}
                                  columnColor={columnColor}
                                  colSpan={colSpan}
                                  clickable={
                                    !!transactionDetailRoom &&
                                    (transactionDetailRoom.borrowed_by_user_id ===
                                      user?.id ||
                                      user?.role === ADMIN_ROLE_INT)
                                  }
                                />
                              );
                            })}
                          </tr>
                        );
                      })}
                  </Fragment>
                );
              })
            ) : (
              <LoadingState isDarkTheme={isDarkTheme} startHour={startHour} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type ScheduleTableDataComponent = {
  transactionDetailRoom: false | BorrowedRoomModel | undefined;
  boldLeft: boolean;
  columnColor: string;
  colSpan: number;
  clickable: boolean;
};

const ScheduleTableDataComponent = ({
  transactionDetailRoom,
  boldLeft,
  columnColor,
  colSpan,
  clickable,
}: ScheduleTableDataComponent) => {
  const [isRelative, setRelative] = useState(true);
  const tdRef = useRef<HTMLTableCellElement | null>(null);

  useEffect(() => {
    // Scroll event listener to track table scroll
    const handleScroll = () => {
      const table = tdRef.current?.closest("tr")!.querySelector("th")!;

      if (table && tdRef.current) {
        const tableRect = table.getBoundingClientRect();
        const tdRect = tdRef.current.getBoundingClientRect();
        const relativeX = tdRect.left - tableRect.left;

        if (relativeX < 150) {
          setRelative(false);
        } else {
          setRelative(true);
        }
      }
    };

    // Add scroll event listener to the table
    const tableElement = document.getElementById("table-container");
    tableElement?.addEventListener("scroll", handleScroll);

    // Cleanup on component unmount
    return () => {
      tableElement?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <td
      ref={tdRef}
      onClick={() => {
        if (!transactionDetailRoom) return;
        if (!clickable) return;

        const url =
          "/room-request/" + (transactionDetailRoom as BorrowedRoomModel).id;
        window.open(url, "_blank");

        // Instead of on click, i want to move this code to listen every table is scroll
        // const table = e.currentTarget.closest("tr")!.querySelector("th")!;
        // const tableRect = table?.getBoundingClientRect();

        // const tdRect = e.currentTarget.getBoundingClientRect();
        // const relativeX = tdRect.left - tableRect.left;

        // console.log(relativeX);
        // // const relativeX = tdRect.left - tableRect.left;

        // if (relativeX < 150) {
        //   setRelative(false);
        // } else {
        //   setRelative(true);
        // }

        // console.log("Relative X position of the td to the table:", relativeX);
      }}
      className={classJoin(
        "border w-8 h-8 cursor-pointer -z-10",
        boldLeft ? "border-l-4" : "",
        columnColor,
      )}
      colSpan={colSpan}
    >
      {transactionDetailRoom && (
        <div
          className={classJoin(
            "group cursor-pointer",
            isRelative ? "relative" : ""
          )}
        >
          <div className={`truncate`} style={{maxWidth: `${2 * colSpan}rem`}}>
            {transactionDetailRoom.event_name}
          </div>
          <span className="absolute -top-14 left-1/2 -translate-x-1/2 scale-0 transition-transform duration-200 ease-out group-hover:scale-100 p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg flex flex-col min-w-32">
            <span>{`${transactionDetailRoom.start_borrowing_time} - ${transactionDetailRoom.end_event_time}`}</span>
            <span>
              {transactionDetailRoom.pic_name} (
              {transactionDetailRoom.pic_phone_number})
            </span>
          </span>
        </div>
      )}
    </td>
  );
};

const LoadingState = ({
  isDarkTheme,
  startHour,
}: {
  isDarkTheme: boolean;
  startHour: number;
}) => {
  return (
    <tr className="border">
      <th
        className={classJoin(
          !isDarkTheme
            ? "bg-neutral-700 text-white"
            : "bg-transparent text-gray-300 border-b"
        )}
        colSpan={(24 - startHour) * SLOT_PER_HOUR + 1}
      >
        <span className="w-32 flex flex-row items-end gap-0.5">
          Loading<span className="loading loading-dots loading-xs"></span>
        </span>
      </th>
      {/* <td className={classJoin(!isDarkTheme ? "bg-neutral-700" : "dark:bg-transparent", "text-white")} colSpan={(24 - startHour) * SLOT_PER_HOUR + 1}>Loading</td> */}
    </tr>
  );
};

export default RoomSchedule;
