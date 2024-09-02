"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Moon,
  Sun,
  Bell,
  HelpCircle,
  LogOut,
  Book,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function Component() {
  const [theme, setTheme] = useState("light");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // update the HTML class or a context here
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-4">
          <Link
            href="/books"
            className="flex items-center space-x-2 hover:text-primary-foreground/80"
          >
            <Book size={20} />
            <span>Books</span>
          </Link>
          <Link
            href="/transactions"
            className="flex items-center space-x-2 hover:text-primary-foreground/80"
          >
            <DollarSign size={20} />
            <span>Transactions</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <span className="flex items-center">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="User avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  Profile
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
        <p>Your main content goes here.</p>
      </main>
    </div>
  );
}
