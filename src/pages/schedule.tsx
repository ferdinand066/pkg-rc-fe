import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchUser } from "../hooks/admin/use-user";
import { UserModel } from "../model/entities/user";
import PageHeader from "../components/layout/PageHeader";
import Table from "../components/utils/Table";
import Pagination from "../components/utils/Pagination";

const header = ['name', 'email', 'email_verified_at', 'account_accepted_at', 'account_accepted_by'];

const ScheduleIndexPage = () => {
  const navigate = useNavigate();

  const [param, setParam] = useState({
    page: 1,
  });

  const { data, status } = useFetchUser(param);

  const users = data?.data.map((user: UserModel) => ({
    ...user,
    email_verified_at: user.email_verified_at ?? '-',
    account_accepted_at: user.account_accepted_at ?? '-',
    account_accepted_by: user.account_accepted_by ?? '-',
    redirect: '/admin/user/' + user.id,
  }));

  console.log(users);

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader
        pageName="User"
      />
      <Table 
        header={header}
        data={users ?? []}
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

export default ScheduleIndexPage;
