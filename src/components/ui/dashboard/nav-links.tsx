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
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the top navigation bar.
// TODO mapping  of links should be dynamic such that user and admin can enjoy their own privilages

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Transactions",
    href: "/dashboard/transaction",
    icon: DollarSign,
  },
  { name: "Request Book", href: "/dashboard/requestBook", icon: Book },
];
export default function UserNavLinks() {
  const pathname = usePathname();
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
