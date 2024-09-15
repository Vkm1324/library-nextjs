"use client";

import { useActionState } from "react";
import { updateBook, BookState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface IBookProfile {
  id: number;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbnNo: number;
  image?: string;
  numofPages: number;
  totalNumberOfCopies: number;
  availableNumberOfCopies: number;
}

export default function EditBookForm({ book }: { book: IBookProfile }) {
  const initialState: BookState = { message: null, errors: {} };
  const updateBookWithId = updateBook.bind(null, book.id);
  const [state, formAction] = useActionState(updateBookWithId, initialState);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Book</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={book.title}
                required
              />
              <div className="h-6">
                {state.errors?.title && (
                  <p className="text-sm text-red-500">{state.errors.title}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                defaultValue={book.author}
                required
              />
              <div className="h-6">
                {state.errors?.author && (
                  <p className="text-sm text-red-500">{state.errors.author}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                name="publisher"
                defaultValue={book.publisher}
                required
              />
              <div className="h-6">
                {state.errors?.publisher && (
                  <p className="text-sm text-red-500">
                    {state.errors.publisher}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                name="genre"
                defaultValue={book.genre}
                required
              />
              <div className="h-6">
                {state.errors?.genre && (
                  <p className="text-sm text-red-500">{state.errors.genre}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbnNo">ISBN Number</Label>
              <Input
                id="isbnNo"
                name="isbnNo"
                type="number"
                defaultValue={book.isbnNo.toString()}
                required
              />
              <div className="h-6">
                {state.errors?.isbnNo && (
                  <p className="text-sm text-red-500">{state.errors.isbnNo}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numofPages">Number of Pages</Label>
              <Input
                id="numofPages"
                name="numofPages"
                type="number"
                defaultValue={book.numofPages.toString()}
                required
              />
              <div className="h-6">
                {state.errors?.numofPages && (
                  <p className="text-sm text-red-500">
                    {state.errors.numofPages}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalNumberOfCopies">
                Total Number of Copies
              </Label>
              <Input
                id="totalNumberOfCopies"
                name="totalNumberOfCopies"
                type="number"
                defaultValue={book.totalNumberOfCopies.toString()}
                required
              />
              <div className="h-6">
                {state.errors?.totalNumberOfCopies && (
                  <p className="text-sm text-red-500">
                    {state.errors.totalNumberOfCopies}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableNumberOfCopies">
                Available Number of Copies
              </Label>
              <Input
                id="availableNumberOfCopies"
                name="availableNumberOfCopies"
                type="number"
                defaultValue={book.availableNumberOfCopies.toString()}
                required
              />
              <div className="h-6">
                {state.errors?.availableNumberOfCopies && (
                  <p className="text-sm text-red-500">
                    {state.errors.availableNumberOfCopies}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                defaultValue={book.image || ""}
              />
              <div className="h-6">
                {state.errors?.image && (
                  <p className="text-sm text-red-500">{state.errors.image}</p>
                )}
              </div>
            </div>
          </div>
          {state.message && (
            <Alert variant="default">
              <AlertDescription className="bold">
                {state.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            href="/dashboard/admin/books"
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          >
            Cancel
          </Link>
          <Button type="submit">Update Book</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
