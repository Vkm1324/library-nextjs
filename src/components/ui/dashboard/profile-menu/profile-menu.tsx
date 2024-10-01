import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlarmClock,
  BadgeIndianRupee,
  Bell,
  LogOutIcon,
  MessageCircleMore,
  UserRoundPenIcon,
} from "lucide-react";
import { auth } from "../../../../../auth";
import Image from "next/image";
import Logout from ".././profile/logout";
import Link from "next/link";  
import { getTranslations } from "next-intl/server"; 
import BuyProduct from "@/components/razorpay/BuyProduct";
import { getRole } from "@/middleware";
import { UserRepository } from "@/lib/user-management/user.repository";



export default async function ProfileMenu() { 
  const session = await auth();
  const userImage = session?.user?.image;
  const uId = session?.user?.uId;
  const roleId = session?.user?.role;
  const role = getRole(roleId);
  const user = new UserRepository();
  const userDetails = await user.getById(uId!);
  const t = await getTranslations("profile-links"); 
const profileLinks = [
  {
    name: "Profile",
    href: "/dashboard/profile",
    optionalData: getRole(userDetails?.role),
    icon: UserRoundPenIcon,
  },
  {
    name: "My Transaction",
    href: "/dashboard/myTransaction",
    icon: Bell,
  },
  {
    name: "My Requests",
    href: "/dashboard/myRequests",
    icon: MessageCircleMore,
  },
  {
    name: "My Meetings",
    href: "/dashboard/myMeeting",
    icon: AlarmClock,
  },
  {
    name: "Buy Credits",
    optionalData: userDetails?.credits,
    href: "/dashboard/credits",
    icon: BadgeIndianRupee,
  },
  {
    name: "Sign Out",
    href: "dashboard/logout",
    icon: LogOutIcon,
  },
];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Image
            src={`${userImage}`}
            width={560}
            height={620}
            alt="User avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {profileLinks.map((link, index) => (
          <DropdownMenuItem key={index} asChild>
            {link.name === "Sign Out" ? (
              <Logout />
            ) : link.name === "Buy Credits" ? (
              <BuyProduct userUid={uId!}></BuyProduct>
            ) : (
              <Link key={link.name} href={link.href}>
                <link.icon className="mr-2 h-4 w-4" />
                {t(link.name)}
                {link.optionalData && (
                  <span className="text-sm ml-2 text-green-300">{link.optionalData}</span>
                )}
              </Link>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

 
