import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/layout/PageHeader";
import Pagination from "../../../components/utils/Pagination";
import Table from "../../../components/utils/Table";
import { useFetchUser } from "../../../hooks/admin/use-user";
import { UserModel } from "../../../model/entities/user";
import { useFetchRoom } from "../../../hooks/general/use-room";
import { RoomModel } from "../../../model/entities/room";

const header = ['name', 'floor_name', 'items'];

const RoomIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });

  const { data, status } = useFetchRoom(param);

  console.log(data);

  const rooms = data?.data.map((room: RoomModel) => ({
    ...room,
    floor_name: room.floor.name,
    items: room?.room_items?.map((item) => item.item.name).join(",")
  }));

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Ruangan"
        action={
          <button type="button" className="btn btn-primary h-10 max-h-10 text-sm">Tambah Ruangan</button>
        }
      />
      <Table 
        header={header}
        data={rooms ?? []}
      />
      <Pagination status={status} data={data} page={param.page} setPage={setParam}/>
      
      {/* <div className="flex flex-row justify-between items-center px-6">
        <span className="hidden md:inline-flex text-sm">
          Showing 1 to 10 of 100 results
        </span>
        <div className="hidden md:flex flex-row join">
          <button className="shadow join-item btn h-10 min-h-10 text-neutral-500">
            <ChevronDoubleLeftIcon
              className="w-5 h-5"
              aria-hidden="true"
            />
          </button>
          <button className="shadow join-item btn h-10 min-h-10 text-neutral-500">1</button>
          <button className="shadow join-item btn h-10 min-h-10 btn-primary">
            2
          </button>
          <button className="shadow join-item btn h-10 min-h-10 btn-disabled">
            ...
          </button>
          <button className="shadow join-item btn h-10 min-h-10 text-neutral-500">99</button>
          <button className="shadow join-item btn h-10 min-h-10 text-neutral-500">100</button>
          <button className="shadow join-item btn h-10 min-h-10 text-neutral-500">
            <ChevronDoubleRightIcon
              className="w-5 h-5"
              aria-hidden="true"
            />
          </button>
        </div>
        <button className="flex md:hidden shadow join-item btn h-10 min-h-10 text-neutral-500">
          <ChevronDoubleLeftIcon
            className="w-5 h-5"
            aria-hidden="true"
          />
          Previous
        </button>
        <button className="flex md:hidden shadow join-item btn h-10 min-h-10 text-neutral-500">
          Next
          <ChevronDoubleRightIcon
            className="w-5 h-5"
            aria-hidden="true"
          />
        </button>
      </div> */}
    </section>
  );
};

export default RoomIndex;
