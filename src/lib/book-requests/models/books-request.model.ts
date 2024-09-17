export interface IBookRequestBase {
  userId: number;
  bookId: number;
  requestDate: Date;
}

export interface IBookResquest extends IBookRequestBase {
  bookTitle: string;
  id: number;
  status: "pending" | "approved" | "rejected";
}
