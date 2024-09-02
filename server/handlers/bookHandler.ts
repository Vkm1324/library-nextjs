import { Request, Response, NextFunction } from "express";
import { BookRepository } from "../../src/book-management/books.repository";

const bookRepository = new BookRepository();

export const addBookHandler = async (req: Request, res: Response) => {
  if (req.method === "POST" && req.path === "/books") {
    try {
      console.log("addBook started");

      // Get the request body
      const body = req.body;
      const createdBook = await bookRepository.create(body);

      // Send a successful response
      res.status(201).json({
        message: "Book added successfully",
        createdBook,
      });
    } catch (error) {
      // Send an error response
      console.error("Error creating book:", error.message);
      res.status(400).json({ message: "Duplicate entry for ISBN" });
    }
  } else {
    // Handle methods other than POST
    res.status(405).send("Method Not Allowed");
  }
};

export const getBookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO implement to get pagination of books
  // const { id, isbn, title } = req.query;
  // try {
  //   if (id) {
  //     const book = await bookRepository.getById(Number(id));
  //     if (book) {
  //       res.status(200).json(book);
  //     } else {
  //       res.status(404).json({ message: "Book not found" });
  //     }
  //   } else if (isbn) {
  //     const book = await bookRepository.getByIsbn(+(isbn));
  //     if (book) {
  //       res.status(200).json(book);
  //     } else {
  //       res.status(404).json({ message: "Book not found" });
  //     }
  //   } else if (title) {
  //     const books = await bookRepository.getByTitle(String(title));
  //     if (books.length > 0) {
  //       res.status(200).json(books);
  //     } else {
  //       res.status(404).json({ message: "Book not found" });
  //     }
  //   } else {
  //     res.status(400).json({ message: "Bad Request" });
  //   }
  // } catch (error) {
  //   res.status(500).json({ message: "Internal Server Error", error });
  // }
};
export const getBookByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const book = await bookRepository.getById(Number(id));
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const getBookByIsbnHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isbn } = req.params;

  try {
    const book = await bookRepository.getByIsbn(+isbn);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const getBookByTitleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.params;

  try {
    const books = await bookRepository.getByTitle(String(title));
    if (books.length > 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const deleteBookByIdHandler = async (req: Request, res: Response) => {
  if (req.method === "DELETE" && req.path === "/books") {
    const id = req.query.id as string;
    if (id) {
      try {
        const deletedBook = await bookRepository.delete(Number(id));
        if (deletedBook) {
          res.status(200).json({
            message: "Book deleted successfully",
            deletedBook,
          });
        } else {
          res.status(404).json({ message: "Book not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
      }
    } else {
      res.status(400).json({ message: "Missing id parameter" });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
