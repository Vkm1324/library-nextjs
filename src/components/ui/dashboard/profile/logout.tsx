import { LogOutIcon } from "lucide-react";
import { signOut } from "../../../../../auth";

export default function Logout() {
  return (
  <form
    action={async () => {
      "use server";
      await signOut({ redirectTo: "/" });
    }}
  >
    <button className="flex h-[36px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50  text-sm font-medium hover:bg-red-100 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3">
      <LogOutIcon className="w-6" />
      <div className="hidden md:block">Sign Out</div>
    </button>
    </form>
  );
}