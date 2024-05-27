import { startCase } from "lodash";
import { classJoin } from "../../lib/functions";
import { TableOrderType } from "../../model/components/table-order";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";

type TableProps = {
  header: string[];
  data: object[];
  numbering?: boolean;
  enableSort?: boolean;
  sortData?: TableOrderType;
  setSortData?: React.Dispatch<React.SetStateAction<TableOrderType>>;
};

const Table = ({
  header,
  data,
  numbering = false,
  enableSort = false,
  sortData,
  setSortData,
}: TableProps) => {
  const tableHeader = header.filter((h) => h !== "action");
  return (
    <div className="overflow-x-auto rounded-lg shadow mx-6">
      <table className="table table-pin-rows table-zebra-zebra rounded">
        <thead>
          <tr className="bg-base-300 border-b">
            {numbering && <th></th>}
            {tableHeader.map((h) => (
              <td
                key={h + "_table"}
                className={classJoin(
                  "relative",
                  enableSort && h != "action" ? "cursor-pointer" : ""
                )}
              >
                <span>{startCase(h)}</span>
                {h !== "action" &&
                  enableSort &&
                  sortData &&
                  sortData.order_by === h &&
                  (sortData.data_order === "asc" ? (
                    <ChevronUpIcon className="absolute w-4 h-4 transform -translate-y-1/2 top-1/2 right-2" />
                  ) : (
                    <ChevronDownIcon className="absolute w-4 h-4 transform -translate-y-1/2 top-1/2 right-2" />
                  ))}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d, index) => (
              <tr key={index}>
                {numbering && <th>{index + 1}</th>}

                {tableHeader.map((h, i) => {
                  if (i===0 && (d as any)['redirect']){
                    return <td className="hover:text-primary font-bold" key={i}><Link to={(d as any)['redirect']}>{(d as any)[h]}</Link></td>
                  } else if ( i === 0 && (d as any)['onClick']) {
                    return <td className="hover:text-primary font-bold cursor-pointer" onClick={() => (d as any)['onClick']()} key={i}>{(d as any)[h]}</td>
                  }
                  return <td key={i}>{(d as any)[h]}</td>
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length}>Tidak ada data!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
