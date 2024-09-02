import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, Calendar, Users, ChevronDown } from "lucide-react";
import Search from "@/components/ui/landingPage/search";
import { Suspense } from "react";
import { fetchBooksCount } from "@/lib/book-management/books.repository";
import Pagination from "@/components/ui/landingPage/pagination";
import BooksGrid from "@/components/ui/landingPage/booksGrid";
import BooksGridSkeleton from "@/components/ui/skeletons/booksGrid";

export default async function LandingPage({ searchParams, }: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchBooksCount(query);
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                Catalog
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Books</DropdownMenuItem>
              <DropdownMenuItem>eBooks</DropdownMenuItem>
              <DropdownMenuItem>Magazines</DropdownMenuItem>
              <DropdownMenuItem>Maps</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            className="text-sm font-medium hover:underline hidden sm:block underline-offset-4"
            href="#"
          >
            Events
          </Link>
          <Link
            className="text-sm font-medium hidden sm:block hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <Button variant="default">Sign In</Button>
        </nav>
      </header>
      <main className="flex-1">
        <h1 className="text-3xl pl-4 font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
          Welcome to Library...
        </h1>
        <section className="w-full py-12 md:py-24 lg:py-0 xl:py-0">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start space-y-4 text-center">
              {/* Rendering the search client component */}
              <div className="mt-4 px-0 flex items-start justify-between gap-2 md:mt-8">
                <Search placeholder="Search.. Enter title " />
              </div>
              {/* Rendering the Books Table component */}
              {
                <Suspense
                  key={query + currentPage}
                  fallback={<BooksGridSkeleton />}
                >
                  <BooksGrid query={query} currentPage={currentPage} />
                </Suspense>
              }
              <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-20 lg:py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Book className="h-10 w-10" />
                <h2 className="text-xl font-bold">Extensive Collection</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Access thousands of books, e-books, audiobooks, and more.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Calendar className="h-10 w-10" />
                <h2 className="text-xl font-bold">Events & Programs</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Join our reading clubs, workshops, and educational programs.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Users className="h-10 w-10" />
                <h2 className="text-xl font-bold">Community Space</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Enjoy our quiet study areas and collaborative spaces.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 Library. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
