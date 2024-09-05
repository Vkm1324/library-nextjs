export interface IBookRequestBase {
  userId: number;
  bookId: number;
  requestDate: Date;
}

export interface IBookResquest extends IBookRequestBase {
  id: number;
  status: "pending" | "approved" | "rejected";
}
