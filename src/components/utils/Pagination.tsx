import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { PaginationProps } from "../../model/components/pagination";
import LoadingSkeleton from "./LoadingSkeleton";
import { classJoin } from "../../lib/functions";

type PaginationComponentProps<T> = {
  status: "error" | "pending" | "success";
  data: PaginationProps<T> | undefined;
  page: number;
  setPage: React.Dispatch<
    React.SetStateAction<{
      page: number;
    }>
  >;
};

export default function Pagination<T>({
  status,
  data,
  page,
  setPage,
}: PaginationComponentProps<T>) {
  const handlePageChange = (str: string) => {
    const url = new URL(str);
    const queryParams = new URLSearchParams(url.search);

    const page = queryParams.get("page") ?? "1";
    setPage((prev) => ({ ...prev, page: parseInt(page) }));
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-base-200 sm:px-6">
      <div className="flex justify-between flex-1 md:hidden">
        {status === "success" ? (
          <>
            {data?.prev_page_url ? (
              <button
                onClick={() => handlePageChange(data.prev_page_url!)}
                className="flex md:hidden shadow join-item btn h-10 min-h-10 text-neutral-500"
              >
                <ChevronDoubleLeftIcon
                  className="w-5 h-5"
                  aria-hidden="true"
                />
                Previous
              </button>
            ) : (
              <span />
            )}
            {data?.next_page_url ? (
              <button
                onClick={() => handlePageChange(data.next_page_url!)}
                className="flex md:hidden shadow join-item btn h-10 min-h-10 text-neutral-500"
              >
                Next
                <ChevronDoubleRightIcon
                  className="w-5 h-5"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <span />
            )}
          </>
        ) : (
          <>
            <LoadingSkeleton className="w-24 h-10" />
            <LoadingSkeleton className="w-24 h-10" />
          </>
        )}
      </div>
      <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
        <div>
          {status === "success" ? (
            data!.total > 0 ? (
              <p className="text-sm text-gray-700 mr-2">
                Menampilkan data <span className="font-medium">{data?.from}</span> sampai{" "}
                <span className="font-medium">{data?.to}</span> dari{" "}
                <span className="font-medium">{data?.total}</span> data
              </p>
            ) : (
              <></>
            )
          ) : (
            <div>
              <LoadingSkeleton className="w-48 h-4" />
            </div>
          )}
        </div>
        <div>
          <nav
            className="hidden md:flex flex-row join"
            aria-label="Pagination"
          >
            {status === "success" ? (
              data!.total > 0 ? (
                data?.links
                  .map((link, index) => {
                    let child: string | JSX.Element = link.label;
                    if (child.includes("&laquo")) {
                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(link.url!)}
                          className="shadow join-item btn h-10 min-h-10 text-neutral-500 hover:text-neutral-700"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronLeftIcon
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                        </button>
                      );
                    } else if (child.includes("&raquo")) {
                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(link.url!)}
                          className="shadow join-item btn h-10 min-h-10 text-neutral-500 hover:text-neutral-700"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => handlePageChange(link.url!)}
                        key={index}
                        disabled={!link.url}
                        className={classJoin(
                          "shadow join-item btn h-10 min-h-10 text-neutral-500 hover:text-neutral-700",
                          index === 0 ? "rounded-l-md" : "",
                          index ===
                            data?.links.filter((link) => link.url).length - 1
                            ? "rounded-r-md"
                            : "",
                          page === parseInt(link.label!)
                            ? "text-gray-700"
                            : "text-gray-400"
                        )}
                      >
                        {child}
                      </button>
                    );
                  })
              ) : (
                <></>
              )
            ) : (
              <LoadingSkeleton className="w-56 h-8" />
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
