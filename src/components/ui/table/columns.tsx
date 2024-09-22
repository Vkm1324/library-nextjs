export interface GenericColumn<TData> {
  header: string;
  accessorKey?: keyof TData; // accessorKey 
  // Optionally, a render function if a column needs custom rendering
  render?: (data: TData) => React.ReactNode;
}