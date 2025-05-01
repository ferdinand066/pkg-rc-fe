import { format } from "date-fns";
import { useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import Pagination from "../../../components/utils/Pagination";
import Table, { TableHeaderProps } from "../../../components/utils/Table";
import { useFetchUser } from "../../../hooks/admin/use-user";
import { UserModel } from "../../../model/entities/user";
import InputText from "../../../components/forms/InputText";
import { TableOrderType } from "../../../model/components/table-order";

const header: TableHeaderProps[] = [
  {
    name: "name",
    sortable: true,
  },
  {
    name: "email",
    sortable: true,
  },
  {
    name: "email_verified_at",
    sortable: true,
  },
  {
    name: "account_accepted_at",
    sortable: false,
  },
  {
    name: "accepted_by",
    sortable: false,
  },
]

const UserIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });
  const [sort, setSort] = useState<TableOrderType>({
    order_by: "name",
    data_order: "asc",
  });

  const [inputValue, setInputValue] = useState("");
  const { data, status } = useFetchUser(param, sort);

  const users = data?.data.map((user: UserModel) => ({
    ...user,
    email_verified_at: user.email_verified_at ? format(user.email_verified_at, "MMMM do, yyyy") : '-',
    account_accepted_at: user.account_accepted_at ? format(user.account_accepted_at, "MMMM do, yyyy") : '-',
    accepted_by: user.accepted_by?.name ?? '-',
    redirect: '/admin/user/' + user.id,
  }));

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="User"
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
          onClick={() => setParam(() => ({page: 1, search: inputValue}))}
        >
          Cari
        </button>
      </div>
      <Table 
        header={header}
        data={users ?? []}
        status={status}
        sortData={sort}
        setSortData={setSort}
        enableSort
      />
      <Pagination status={status} data={data} page={param.page} setPage={setParam}/>
    </section>
  );
};

export default UserIndex;
