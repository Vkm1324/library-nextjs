"use server"

import { BookRepository } from "@/lib/book-management/books.repository"


export async function getAllBooks(search: string | number) {
  const bookRepo = new BookRepository(); 

  if (search) {
    if (typeof search === "string") {
      // If search is a title
      return await bookRepo.getByTitle(search);
    } else {
      // If search is an ID
      return await bookRepo.getById(Number(search));
    }
  } else {
    // If no search term is provided, return all books
    return await bookRepo.getBooks();
  }
}


