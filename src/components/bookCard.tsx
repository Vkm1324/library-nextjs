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
      key={book.id}
      className="overflow-hidden items-center justify-center transition-shadow hover:shadow-lg"
      onClick={handleRequestBook}
    >
      {book.image ? (
        <Image
          src={`${book.image}`}
          width={200}
          height={180}
          alt={book.title}
          className="  object-cover"
        />
      ) : (
        <Image
          src={image}
          width={200}
          height={180}
          alt={"static image"}
          className=" object-cover"
        ></Image>
      )}
      <CardHeader className="p-4 bg-muted">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {book.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{book.author}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Building className="w-4 h-4" />
          <span>{book.publisher}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>{book.genre}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Hash className="w-4 h-4" />
          <span>{book.isbnNo}</span>
        </div>
        <div className="flex items-center space-x-2">
          <BookCopy className="w-4 h-4" />
          <Badge
            variant={
              book.availableNumberOfCopies > 0 ? "default" : "destructive"
            }
          >
            {book.availableNumberOfCopies > 0 ? "Available" : "Not Available"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
