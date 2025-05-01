import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputText from "../../../components/forms/InputText";
import PageHeader from "../../../components/layout/PageHeader";
import Pagination from "../../../components/utils/Pagination";
import Table, { TableHeaderProps } from "../../../components/utils/Table";
import { useFetchBorrowedRoom } from "../../../hooks/general/use-borrowed-room";
import { BORROWED_STATUS } from "../../../lib/constants";
import { authAtom } from "../../../lib/state/auth-state";
import { BorrowedRoomModel } from "../../../model/entities/borrowed-room";
import { TableOrderType } from "../../../model/components/table-order";

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

  const [inputValue, setInputValue] = useState("");
  const authValue = useAtomValue(authAtom);

  const { data, status } = useFetchBorrowedRoom(param, sort);
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

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Proposal Pinjam Ruang"
        action={
          parseInt(authValue?.roleId ?? "1") === 1 ? (
            <button
              type="button"
              onClick={() => navigate("/room-request/create")}
              className="btn btn-primary h-10 max-h-10 text-sm"
            >
              Buat Proposal
            </button>
          ) : (
            <></>
          )
        }
      />
      <div className="mx-6 flex flex-row items-end gap-4 justify-end">
        <div className="w-full lg:max-w-80">
          <InputText
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Cari..."
          />
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setParam(() => ({ page: 1, search: inputValue }))}
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
