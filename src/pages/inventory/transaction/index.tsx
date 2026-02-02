import { useRef, useState } from "react";
import PageHeader from "../../../components/layout/page-header";
import DialogButton from "../../../components/utils/dialog-button";
import Pagination from "../../../components/utils/pagination";
import Table, { TableHeaderProps } from "../../../components/utils/table";
import { useFetchItemHistories } from "../../../hooks/admin/use-item-history";
import { ItemHistoryModel } from "../../../model/entities/item";
import { TableOrderType } from "../../../model/components/table-order";
import AddTransactionModal from "./components/add-transaction-modal";
import { TYPE_OPTIONS } from "./constants";

const header: TableHeaderProps[] = [
  { name: "item_name", sortable: true },
  { name: "type", sortable: true },
  { name: "room_name", sortable: false },
  { name: "quantity", sortable: true },
  { name: "user_name", sortable: false },
];

const ItemHistoryIndex = () => {
  const [param, setParam] = useState({ page: 1 });
  const [sort, setSort] = useState<TableOrderType>({
    order_by: "item_name",
    data_order: "asc",
  });
  const modalRef = useRef<HTMLDialogElement>(null);

  const { data, status } = useFetchItemHistories(param, sort);

  const rows = data?.data?.map((row: ItemHistoryModel) => ({
    item_name: row.item?.name ?? "-",
    type:
      TYPE_OPTIONS.find((opt) => opt.id === row.type)?.name ?? row.type ?? "-",
    room_name: row.room?.name ?? "Idle item",
    quantity: row.quantity,
    user_name: row.user?.name ?? "-",
  })) ?? [];

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Transaksi Barang"
        action={
          <DialogButton
            buttonValue="Tambah Transaksi"
            onClick={() => {}}
            ref={modalRef}
          >
            <AddTransactionModal ref={modalRef} />
          </DialogButton>
        }
      />
      <Table
        header={header}
        data={rows}
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

export default ItemHistoryIndex;
