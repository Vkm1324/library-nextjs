"use client";

 import {
  HomeIcon,
  Moon,
  Sun,
  Bell,
  HelpCircle,
  LogOut,
  Book,
  DollarSign,
  FileClock,
  MessageCircleMore,
  Users,
  BookPlus,
  NotebookPen,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the top navigation bar.

const userLinks = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Transactions",
    href: "/dashboard/transaction",
    icon: FileClock,
  },
  { name: "Book Request", href: "/dashboard/requestBook", icon: BookPlus },
];
const adminLinks = [ 
  ...userLinks,
  {
    name: "Users Book Request",
    href: "/dashboard/admin/userRequests",
    icon: NotebookPen,
  },
  { name: "Users", href: "/dashboard/admin/users", icon: Users },
  { name: "Book", href: "/dashboard/admin/books", icon: Book },
];

export default function UserNavLinks({ role }: { role: number }) {
  const pathname = usePathname();
  // TODO role should be string which describes the user role rather than number so use Roles and adjust it
  const links = role === 2020 ? userLinks : adminLinks;
  return (
    <div className="flex flex-row justify-between gap-4">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
