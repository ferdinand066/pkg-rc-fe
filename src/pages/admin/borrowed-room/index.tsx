import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/layout/PageHeader";
import Pagination from "../../../components/utils/Pagination";
import Table from "../../../components/utils/Table";
import { useFetchBorrowedRoom } from "../../../hooks/general/use-borrowed-room";
import { BorrowedRoomModel } from "../../../model/entities/borrowed-room";
import { UserModel } from "../../../model/entities/user";

const header = ["room_name", "borrowed_date", "start_time", "end_time", "borrowed_by"];

const AdminBorrowedRoomIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });

  const { data, status } = useFetchBorrowedRoom(param);
  const navigate = useNavigate();

  const borrowedRooms = data?.data.map((borrowedRoom: BorrowedRoomModel) => {
    const d = {
      ...borrowedRoom,
      room_name: borrowedRoom.room.name,
      borrowed_by: (borrowedRoom.borrowed_by as UserModel).name,
      // borrowed_by_name: borrowedRoom.borrowed_by.name,
      // // floor_name: borrowedRoom.floor.name,
      // items: borrowedRoom?.borrowed_room_items?.map((item) => item.item.name).join(", "),
      // item_id: borrowedRoom?.borrowed_room_items?.map((item) => item.item_id)
    }

    return {
      ...d,
      onClick: () => {
        setSelectedBorrowedRoom(d)
        ref.current?.showModal();
      }
    };
  });

  const [selectedBorrowedRoom, setSelectedBorrowedRoom] = useState<BorrowedRoomModel>();
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Proposal Pinjam Ruang" />
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

export default AdminBorrowedRoomIndex;
