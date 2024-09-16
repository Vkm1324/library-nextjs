"use client";

import { ColumnDef } from "@tanstack/react-table";

// Extend GenericColumn to optionally include a cell property or any other additional properties
export type GenericColumn<T> = {
  accessorKey: keyof T;
  header: string;
  cell?: (info: any) => JSX.Element; // Add an optional cell property for custom rendering
};

// Create a reusable function to define columns
export function createColumns<T>(columns: GenericColumn<T>[]): ColumnDef<T>[] {
  return columns.map((column) => ({
    accessorKey: column.accessorKey,
    header: column.header,
    // cell: column.cell, // Include the cell property if it exists
  }));
}
