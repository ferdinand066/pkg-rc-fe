import { useRef, useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import DialogButton from "../../../components/utils/DialogButton";
import Table, { TableHeaderProps } from "../../../components/utils/Table";
import { useFetchItem } from "../../../hooks/general/use-item";
import { ItemModel } from "../../../model/entities/item";
import ItemManageModal from "./components/ManageModal";
import { PaginationProps } from "../../../model/components/pagination";
import Pagination from "../../../components/utils/Pagination";
import { TableOrderType } from "../../../model/components/table-order";

const header: TableHeaderProps[] = [
  {
    name: "name",
    sortable: true,
  },
  {
    name: "room_at",
    sortable: false,
  },
];

const ItemIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });
  const [sort, setSort] = useState<TableOrderType>({
    order_by: "name",
    data_order: "asc",
  });

  const { data: tempData, status } = useFetchItem(param, sort, true);

  const data = tempData as PaginationProps<ItemModel> | undefined;

  const items = data?.data.map((item: ItemModel) => {
    const d = {
      ...item,
      room_at: (item.room_items ?? []).map((item) => item.room.name).join(", "),
    };

    return {
      ...d,
      room_at: d.room_at ? d.room_at : "-",
      onClick: () => {
        setSelectedItem(d);
        ref.current?.showModal();
      },
    };
  });

  const [selectedItem, setSelectedItem] = useState<ItemModel>();
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Barang"
        action={
          <DialogButton
            buttonValue="Tambah Barang"
            onClick={() => setSelectedItem(undefined)}
            ref={ref}
          >
            <ItemManageModal selectedItem={selectedItem} ref={ref} />
          </DialogButton>
        }
      />
      <Table
        header={header}
        data={items ?? []}
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

export default ItemIndex;
