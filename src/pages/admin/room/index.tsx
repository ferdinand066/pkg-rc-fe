import { useRef, useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import DialogButton from "../../../components/utils/DialogButton";
import Pagination from "../../../components/utils/Pagination";
import Table from "../../../components/utils/Table";
import { useFetchRoom } from "../../../hooks/general/use-room";
import { RoomModel } from "../../../model/entities/room";
import RoomManageModal from "./components/ManageModal";
import { PaginationProps } from "../../../model/components/pagination";

const header = ["name", "floor_name", "items"];

const RoomIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });

  const { data: tempData, status } = useFetchRoom({ ...param, paginate: true });
  const data = tempData as PaginationProps<RoomModel> | undefined;

  const rooms = data?.data.map((room: RoomModel) => {
    const d = {
      ...room,
      floor_name: room.floor.name,
      items: room?.room_items?.map((item) => item.item.name).join(", "),
      item_id: room?.room_items?.map((item) => item.item_id),
    };

    return {
      ...d,
      items: d.items ? d.items : "-",
      onClick: () => {
        setSelectedRoom(d);
        ref.current?.showModal();
      },
    };
  });

  const [selectedRoom, setSelectedRoom] = useState<RoomModel>();
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Ruangan"
        action={
          <DialogButton
            buttonText="Tambah Ruangan"
            onClick={() => setSelectedRoom(undefined)}
            ref={ref}
          >
            <RoomManageModal selectedRoom={selectedRoom} ref={ref} />
          </DialogButton>
        }
      />
      <Table header={header} data={rooms ?? []} />
      <Pagination
        status={status}
        data={data}
        page={param.page}
        setPage={setParam}
      />
    </section>
  );
};

export default RoomIndex;
