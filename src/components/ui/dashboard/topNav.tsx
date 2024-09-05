import UserNavLinks from "./nav-links";
import { signOut } from "../../../../auth";
import { LogOutIcon } from "lucide-react";
import ProfileMenu from "@/components/ui/dashboard/profile";

export default function TopNav() {
  return (
    <div className="flex h-full flex-row px-3 py-4 md:px-2">
      <div className="flex grow justify-end flex-row ">
        <UserNavLinks />
        <ProfileMenu/>
      </div>
    </div>
  );
}
