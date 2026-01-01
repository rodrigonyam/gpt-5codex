import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useEmployeesContext } from "@/context/EmployeeContext";
import { Employee } from "@/types/employee";

export const EmployeeTable = () => {
  const { filteredEmployees, roleMap } = useEmployeesContext();
  const PAGE_SIZE = 10;
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));

  useEffect(() => {
    setPageIndex(0);
  }, [filteredEmployees.length]);

  const start = pageIndex * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedEmployees = filteredEmployees.slice(start, end);

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        header: "Employee",
        accessorKey: "name",
        cell: ({ row }) => (
          <div>
            <Link
              to={`/employees/${row.original.id}`}
              className="font-semibold text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={`View ${row.original.name} profile`}
            >
              {row.original.name}
            </Link>
            <p className="text-xs text-slate-400">{row.original.email}</p>
          </div>
        )
      },
      {
        header: "Department",
        accessorKey: "department"
      },
      {
        header: "Role",
        accessorKey: "roleId",
        cell: ({ row }) => {
          const role = row.original.roleId ? roleMap[row.original.roleId] : undefined;
          if (!role) {
            return <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Unassigned</span>;
          }
          return (
            <div>
              <p className="font-semibold">{role.title}</p>
              <p className="text-xs text-slate-400">{role.permission} access</p>
            </div>
          );
        }
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => <StatusBadge status={getValue() as Employee["status"]} />
      },
      {
        header: "Location",
        accessorKey: "location"
      },
      {
        header: "Projects",
        accessorKey: "projects"
      },
      {
        header: "Hired",
        accessorKey: "hiredAt",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString()
      }
    ],
    [roleMap]
  );

  const table = useReactTable({
    data: paginatedEmployees,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const showingFrom = filteredEmployees.length ? start + 1 : 0;
  const showingTo = Math.min(end, filteredEmployees.length);

  return (
    <div className="glass-panel overflow-hidden" role="region" aria-live="polite">
      <table
        id="employee-table"
        className="w-full border-collapse text-sm"
        aria-label="Employee directory table"
      >
        <caption className="sr-only">Employee directory with department, status, and hire details</caption>
        <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-slate-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} scope="col" className="px-6 py-4">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-white/5 last:border-b-0 hover:bg-white/5">
              {row.getVisibleCells().map((cell, index) =>
                index === 0 ? (
                  <th key={cell.id} scope="row" className="px-6 py-4 text-slate-100">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </th>
                ) : (
                  <td key={cell.id} className="px-6 py-4 text-slate-100">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              )}
            </tr>
          ))}
          {filteredEmployees.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-500">
                No employees match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex flex-col gap-3 border-t border-white/5 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing <span className="font-semibold text-white">{showingFrom}</span> –
          <span className="font-semibold text-white"> {showingTo}</span> of
          <span className="font-semibold text-white"> {filteredEmployees.length}</span>
        </p>
        <div className="flex items-center gap-2" aria-label="Employee pagination controls">
          <button
            type="button"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
            className="inline-flex min-h-[40px] items-center justify-center rounded-2xl border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:border-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            Prev
          </button>
          <span className="text-sm text-white">
            Page {pageIndex + 1} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={pageIndex >= totalPages - 1}
            className="inline-flex min-h-[40px] items-center justify-center rounded-2xl border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:border-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
