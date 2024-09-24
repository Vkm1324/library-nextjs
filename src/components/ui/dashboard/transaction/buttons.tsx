import { dueList, updateTransaction } from "@/lib/actions";

export function ReturnBookButton({ id }: { id: number }) {
  const updateTransactionWithId = updateTransaction.bind(null, id);
  return (
    <form action={updateTransactionWithId}>
      <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all ease-in-out duration-300">
        Return Book
      </button>
    </form>
  );
}

// export function TodaysDueButton({ date }: {date:Date }) { 
//   return (
//     <form action={dueList(date)}>
//       <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all ease-in-out duration-300">
//         Return Book
//       </button>
//     </form>
//   );
// }