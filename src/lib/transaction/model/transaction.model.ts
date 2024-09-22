export interface ITransactionBase {
  // immutable data 
  bookId: number;
  userId: number; 
}

export type transactionType ="borrow" | "return";
export type statusType ="completed"| "overdue";

export interface ITransaction extends ITransactionBase {
  transactionId: number;
  transactionType: transactionType;
  issueddate: Date ;
  dueDate: Date ;
  returnDate: Date;
  status: statusType;
  lateFees: number;
}

export interface ITransactionTable extends ITransaction {
  userName: string;
  title: string;
}
