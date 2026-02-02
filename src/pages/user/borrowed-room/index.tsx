import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputText from "../../../components/forms/input-text";
import PageHeader from "../../../components/layout/page-header";
import Pagination from "../../../components/utils/pagination";
import Table, { TableHeaderProps } from "../../../components/utils/table";
import { useFetchBorrowedRoom } from "../../../hooks/general/use-borrowed-room";
import { BORROWED_STATUS } from "../../../lib/constants";
import { authAtom } from "../../../lib/state/auth-state";
import { BorrowedRoomModel } from "../../../model/entities/borrowed-room";
import { TableOrderType } from "../../../model/components/table-order";
import { FilterIcon } from "@heroicons/react/outline";
import DialogButton from "../../../components/utils/dialog-button";
import FilterBorrowedRoomModal from "./components/filter-borrowed-room-modal";
import { useFilterBorrowedRoomStore } from "./components/use-filter-borrowed-room-store";

const header: TableHeaderProps[] = [
  {
    name: "event_name",
    sortable: true,
  },
  {
    name: "room_name",
    sortable: true,
  },
  {
    name: "floor",
    sortable: true,
  },
  {
    name: "borrowed_date",
    sortable: true,
  },
  {
    name: "start_borrowing_time",
    sortable: false,
  },
  {
    name: "end_event_time",
    sortable: false,
  },
  {
    name: "pic_name",
    sortable: false,
  },
  {
    name: "status",
    sortable: false,
  },
];

const UserBorrowedRoomIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });
  const [sort, setSort] = useState<TableOrderType>({
    order_by: "borrowed_date",
    data_order: "asc",
  });
  const { getFilter } = useFilterBorrowedRoomStore();


  const [inputValue, setInputValue] = useState("");
  const authValue = useAtomValue(authAtom);

  const { data, status } = useFetchBorrowedRoom({
    ...param,
    ...getFilter()
  }, sort);
  const navigate = useNavigate();

  const borrowedRooms =
    data?.data.map((borrowedRoom: BorrowedRoomModel) => {
      const d = {
        ...borrowedRoom,
        borrowed_date: (
          <div className="min-w-56 md:min-w-auto">
            {format(borrowedRoom.borrowed_date, "EEEE, d MMMM yyyy", {
              locale: id,
            })}
          </div>
        ),
        event_name: (
          <div className="min-w-48 md:min-w-auto">
            {borrowedRoom.event_name}
          </div>
        ),
        room_name: (
          <div className="min-w-36 md:min-w-auto">{borrowedRoom.room.name}</div>
        ),
        floor: (
          <div className="min-w-20 md:min-w-auto">
            {borrowedRoom.room.floor.name}
          </div>
        ),
        pic_name: (
          <div className="min-w-32 md:min-w-auto">{borrowedRoom.pic_name}</div>
        ),
        status: BORROWED_STATUS[borrowedRoom.borrowed_status],
      };

      return {
        ...d,
        redirect: "/room-request/" + borrowedRoom.id,
      };
    }) ?? [];

  const ref = useRef<HTMLDialogElement>(null);

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Proposal Pinjam Ruang"
        action={
          parseInt(authValue?.roleId ?? "1") === 1 ? (
            <div className="flex flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate("/room-request/create")}
                className="btn btn-primary h-10 max-h-10 text-sm"
              >
                Buat Proposal
              </button>
              <button
                type="button"
                onClick={() => navigate("/room-request/recurring")}
                className="btn btn-primary h-10 max-h-10 text-sm"
              >
                Buat Proposal Berulang
              </button>
            </div>
          ) : (
            <></>
          )
        }
      />
      <div className="mx-6 flex flex-row items-end gap-2 justify-end">
        <div className="w-full lg:max-w-80">
          <InputText
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Cari..."
          />
        </div>
        <DialogButton
          buttonValue={<FilterIcon className="w-5 h-5" />}
          onClick={() => { }}
          ref={ref}
        >
          <FilterBorrowedRoomModal ref={ref} />
        </DialogButton>
        <button
          className="btn w-20 bg-base-100 hover:bg-gray-200 border-none"
          type="button"
          onClick={() => setParam((prev) => ({ ...prev, page: 1, search: inputValue }))}
        >
          Cari
        </button>
      </div>
      <Table
        header={header}
        data={borrowedRooms ?? []}
        status={status}
        sortData={sort}
        setSortData={setSort}
        enableSort
      />
      <Pagination
        status={status}
        data={data}
        page={param.page}
        setPage={setParam}
      />
    </section>
  );
};

export default UserBorrowedRoomIndex;
