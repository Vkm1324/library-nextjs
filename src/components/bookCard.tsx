"use client";

import { User, Building, BookOpen, BookCopy, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { requestBook } from "@/lib/actions"; 
import Image from "next/image";
import image from "@/../public/images/book1.png"
interface BookCardProps {
  book: {
    image: string | undefined;
    id: number;
    title: string;
    author: string;
    publisher: string;
    genre: string;
    isbnNo: number;
    price: number | null;
    availableNumberOfCopies: number;
  };
  uid?: number;
}

export default function BookCard({ book, uid }: BookCardProps) {
    const handleRequestBook = async () => {
    if (!uid) {
      alert("You must be logged in to request a book.");
      return;
    }
    const confirmRequest = window.confirm(
      `Do you want to request the book "${book.title}"?`
    );
    if (!confirmRequest) return;
    try {
      const reqStatus = await requestBook(uid, book.id);
      alert(reqStatus);
    } catch (error) {
      console.error("Error requesting book:", error);
      alert("Your request has failed to lodge. Please try again.");
    }
  };

  return (
    <Card
      className="w-[300px] overflow-hidden group cursor-pointer transition-shadow hover:shadow-lg"
      onClick={handleRequestBook}
    >
      <div className="relative">
        <div className="aspect-[2/3] overflow-hidden">
          <Image
            src={book.image || image}
            alt={book.title}
            width={300}
            height={450}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <CardContent className="p-4 text-white">
            <h2 className="text-xl font-bold mb-2 line-clamp-2">
              {book.title}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{book.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* < className="w-4 h-4" /> */}
                <span>{book.price? book.price : "N / A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>{book.publisher}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>{book.genre}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>{book.isbnNo}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookCopy className="w-4 h-4" />
                <Badge
                  variant={
                    book.availableNumberOfCopies > 0
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {book.availableNumberOfCopies > 0
                    ? "Available"
                    : "Not Available"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
