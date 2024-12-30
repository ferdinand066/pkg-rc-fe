import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/layout/PageHeader";
import Pagination from "../../../components/utils/Pagination";
import Table from "../../../components/utils/Table";
import { useFetchBorrowedRoom } from "../../../hooks/general/use-borrowed-room";
import { BorrowedRoomModel } from "../../../model/entities/borrowed-room";
import { UserModel } from "../../../model/entities/user";
import { BORROWED_STATUS } from "../../../lib/constants";
import useAuth from "../../../hooks/general/use-auth-user";
import { format } from "date-fns";
import { id } from 'date-fns/locale';
import InputText from "../../../components/forms/InputText";

const header = ["event_name", "room_name", "floor", "borrowed_date", "start_borrowing_time", "end_event_time", "pic_name", "status"];

const UserBorrowedRoomIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });

  const [inputValue, setInputValue] = useState("");

  const { user } = useAuth();

  const { data, status } = useFetchBorrowedRoom(param);
  const navigate = useNavigate();

  const borrowedRooms = data?.data.map((borrowedRoom: BorrowedRoomModel) => {
    const d = {
      ...borrowedRoom,
      borrowed_date: <div className="min-w-56 md:min-w-auto">{format(borrowedRoom.borrowed_date, "EEEE, d MMMM yyyy", {locale: id})}</div>,
      event_name: <div className="min-w-48 md:min-w-auto">{borrowedRoom.event_name}</div>,
      room_name: <div className="min-w-36 md:min-w-auto">{borrowedRoom.room.name}</div>,
      floor: <div className="min-w-20 md:min-w-auto">{borrowedRoom.room.floor.name}</div>,
      borrowed_by: (borrowedRoom.borrowed_by as UserModel).name,
      status: BORROWED_STATUS[borrowedRoom.borrowed_status]
    }

    return {
      ...d,
      redirect: "/room-request/" + borrowedRoom.id,
    };
  });

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Proposal Pinjam Ruang"
        action={ user?.role === 1 ?
          <button type="button" onClick={() => navigate('/room-request/create')} className="btn btn-primary h-10 max-h-10 text-sm">Buat Proposal</button> : <></>
        }
      />
      <div className="mx-6 flex flex-row items-end gap-4 justify-end">
        <div className="w-full lg:max-w-80">
          <InputText
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setParam(() => ({page: 1, search: inputValue}))}
        >
          Cari
        </button>
      </div>
      <Table header={header} data={borrowedRooms ?? []} />
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
