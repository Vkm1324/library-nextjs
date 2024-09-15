export interface IBookRequestBase {
  userId: number;
  bookId: number;
  requestDate: Date;
}

export interface IBookResquest extends IBookRequestBase {
  [x: string]: ReactNode;
  id: number;
  status: "pending" | "approved" | "rejected";
}
