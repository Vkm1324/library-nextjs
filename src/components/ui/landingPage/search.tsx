"use client";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchComponent({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace, refresh } = useRouter();
  
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // Update the URL and then refresh the page data
    replace(`${pathName}?${params.toString()}`);
    refresh();
     // This forces the server components to re-run
  }, 500);

  return (
    <div className="relative flex flex-1 items-center max-w-md">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        className="peer inline w-full max-w-xs rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <SearchIcon className="absolute left-3 h-5 w-4 text-gray-500 peer-focus:text-blue-500" />
    </div>
  );
}
