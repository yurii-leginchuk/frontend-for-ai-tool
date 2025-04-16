import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

const GenericTable = ({
  data,
  columns,
  title = "Table",
  filterKey = null, // наприклад: "name"
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const filteredData = useMemo(() => {
    if (!globalFilter || !filterKey) return data;
    return data.filter((item) =>
      item[filterKey]
        ?.toString()
        .toLowerCase()
        .includes(globalFilter.toLowerCase())
    );
  }, [data, globalFilter, filterKey]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className=" bg-white mt-2">
      {filterKey && (
        <div className="mb-6">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={`Search by ${filterKey}...`}
            className="w-full sm:w-1/3 p-2.5 bg-white border border-gray-300 text-gray-800 text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D6B9FC] transition-all duration-200 ease-in-out hover:border-[#D6B9FC]"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b p-4 text-left font-semibold text-gray-700 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ↑",
                      desc: " ↓",
                    }[header.column.getIsSorted()] || null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
