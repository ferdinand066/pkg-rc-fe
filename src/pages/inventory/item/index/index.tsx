import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/layout/page-header";
import Table, { TableHeaderProps } from "../../../../components/utils/table";
import { useFetchItem } from "../../../../hooks/general/use-item";
import { ItemModel } from "../../../../model/entities/item";
import { PaginationProps } from "../../../../model/components/pagination";
import Pagination from "../../../../components/utils/pagination";
import { TableOrderType } from "../../../../model/components/table-order";

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
  const navigate = useNavigate();
  const [param, setParam] = useState({
    page: 1,
  });
  const [sort, setSort] = useState<TableOrderType>({
    order_by: "name",
    data_order: "asc",
  });

  const { data: tempData, status } = useFetchItem<PaginationProps<ItemModel>>(param, sort, true);

  const data = tempData as PaginationProps<ItemModel> | undefined;

  const items = data?.data.map((item: ItemModel) => {
    const d = {
      ...item,
      room_at: (item.room_items ?? []).map((item) => item.room?.name).filter(Boolean).join(", "),
    };

    return {
      ...d,
      room_at: d.room_at ? d.room_at : "-",
      onClick: () => navigate(`/inventory/item/${item.id}`),
    };
  });

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="Barang"
        action={
          <Link to="/inventory/item/create" className="btn btn-primary">
            Tambah Barang
          </Link>
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
