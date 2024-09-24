import LocaleSwitcher from "@/components/LocaleSwitcher";
import { auth } from "../../../../auth";
import UserNavLinks from "./nav-links"; 
import ProfileMenu from "@/components/ui/dashboard/profile-menu/profile-menu";

export default async function TopNav() {
  const session = await auth();
  const userRole = session?.user.role;
  
  return (
    <div className="flex h-full flex-row px-3 py-4 md:px-2">
      <LocaleSwitcher />
      <div className="flex grow justify-end flex-row ">
        <UserNavLinks role={userRole!} />
        <ProfileMenu />
      </div>
    </div>
  );
}
