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

// Define a more flexible GenericColumn type that works with TData
interface GenericColumn<TData> {
  header: string;
  accessorKey: keyof TData; // The key for accessing the value from TData
  // Optionally, a render function if a column needs custom rendering
  render?: (data: TData[keyof TData]) => React.ReactNode;
}

interface DataTableProps<TData> {
  columns: GenericColumn<TData>[];
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  // Get current sort field and sort order from query params
  const currentSortField = searchParams.get("key");
  const currentSortOrder = searchParams.get("sortOrd") || "asc";

  const handleSort = (field: keyof TData) => {
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
            {columns.map((column) => (
              <TableHead
                key={String(column.accessorKey)}
                className="cursor-pointer"
                onClick={() => handleSort(column.accessorKey)}
              >
                <div className="flex items-center">
                  {column.header}
                  {currentSortField === String(column.accessorKey) && (
                    <>{currentSortOrder === "asc" ? " 🔼" : " 🔽"}</>
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
                {columns.map((column) => (
                  <TableCell key={String(column.accessorKey)}>
                    {/* Use custom render function if provided, else default to value */}
                    {column.render
                      ? column.render(row[column.accessorKey])
                      : String(row[column.accessorKey])}
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
