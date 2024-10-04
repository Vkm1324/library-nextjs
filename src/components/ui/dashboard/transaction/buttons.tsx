import { dueList, updateTransaction } from "@/lib/actions";

// export function ReturnBookButton({ id }: { id: number }) {
//   const updateTransactionWithId = updateTransaction.bind(null, id);
//   return (
//     <form action={updateTransactionWithId}>
//       <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all ease-in-out duration-300">
//         Return Book
//       </button>
//     </form>
//   );
// }

export function ReturnBookButton({ id }: { id: number }) {
  const handleReturn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    const response = await updateTransaction(id); // Call your updateTransaction function with the id
    if (response.message) {
      console.log(response.message); // Handle the response message as needed
    }
  };

  return (
    <form onSubmit={handleReturn}>
      <button
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all ease-in-out duration-300"
        type="submit"
      >
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