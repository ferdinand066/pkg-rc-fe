import { format } from "date-fns";
import { useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import Pagination from "../../../components/utils/Pagination";
import Table from "../../../components/utils/Table";
import { useFetchUser } from "../../../hooks/admin/use-user";
import { UserModel } from "../../../model/entities/user";

const header = ['name', 'email', 'email_verified_at', 'account_accepted_at', 'accepted_by'];

const UserIndex = () => {
  const [param, setParam] = useState({
    page: 1,
  });

  const { data, status } = useFetchUser(param);

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
      <Table 
        header={header}
        data={users ?? []}
        status={status}
      />
      <Pagination status={status} data={data} page={param.page} setPage={setParam}/>
    </section>
  );
};

export default UserIndex;
