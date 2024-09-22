"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GenericColumn } from "./columns";

interface DataTableProps<TData> {
  columns: GenericColumn<TData>[];
  data: TData[];
  initialSortKey?: keyof TData;
}

export function DataTable<TData>({
  columns,
  data,
  initialSortKey,
}: DataTableProps<TData>) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const currentSortField = searchParams.get("key") || String(initialSortKey);
  const currentSortOrder = searchParams.get("sortOrd") || "asc";

  const handleSort = (field?: keyof TData) => {
    if (!field) return;

    const isSameField = currentSortField === String(field);
    const newSortOrder =
      isSameField && currentSortOrder === "asc" ? "desc" : "asc";

    const params = new URLSearchParams(searchParams);
    params.set("key", String(field));
    params.set("sortOrd", newSortOrder);

    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="hidden md:block rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, columnIndex) => (
              <TableHead
                key={columnIndex}
                className={`text-left font-bold ${
                  column.accessorKey ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => handleSort(column.accessorKey)}
              >
                <div className="flex items-center">
                  <span className="truncate max-w-[150px]">
                    {column.header}
                  </span>
                  {column.accessorKey &&
                    currentSortField === String(column.accessorKey) && (
                      <span className="ml-1">
                        {currentSortOrder === "asc" ? " 🔼" : " 🔽"}
                      </span>
                    )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={columnIndex}
                    className={`text-left ${
                      column.header === "Actions"
                        ? "max-w-[250px] "
                        : "max-w-[200px] "
                    }`}
                  >
                    <div className="truncate">
                      {column.render
                        ? column.render(row)
                        : column.accessorKey
                        ? String(row[column.accessorKey])
                        : null}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
