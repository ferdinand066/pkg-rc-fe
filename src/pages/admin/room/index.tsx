import { useRef, useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import DialogButton from "../../../components/utils/DialogButton";
import Pagination from "../../../components/utils/Pagination";
import Table, { TableHeaderProps } from "../../../components/utils/Table";
import { useFetchRoom } from "../../../hooks/general/use-room";
import { RoomModel } from "../../../model/entities/room";
import RoomManageModal from "./components/ManageModal";
import { PaginationProps } from "../../../model/components/pagination";
import { TableOrderType } from "../../../model/components/table-order";

const header: TableHeaderProps[] = [
  {
    name: "name",
    sortable: true,
  },
  {
    name: "floor_name",
    sortable: true,
  },
  {
    name: "items",
    sortable: false,
  },
];

const RoomIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });
  const [sort, setSort] = useState<TableOrderType>({
    order_by: "name",
    data_order: "asc",
  });

  const { data: tempData, status } = useFetchRoom(param, sort, true);
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
            buttonValue="Tambah Ruangan"
            onClick={() => setSelectedRoom(undefined)}
            ref={ref}
          >
            <RoomManageModal selectedRoom={selectedRoom} ref={ref} />
          </DialogButton>
        }
      />
      <Table header={header} data={rooms ?? []} status={status} sortData={sort} setSortData={setSort} enableSort />
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
