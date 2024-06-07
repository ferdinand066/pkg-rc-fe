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

const header = ["room_name", "borrowed_date", "start_borrowing_time", "end_event_time", "borrowed_by", "status"];

const UserBorrowedRoomIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });

  const { user } = useAuth();

  const { data, status } = useFetchBorrowedRoom(param);
  const navigate = useNavigate();

  const borrowedRooms = data?.data.map((borrowedRoom: BorrowedRoomModel) => {
    const d = {
      ...borrowedRoom,
      room_name: borrowedRoom.room.name,
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
