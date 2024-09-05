import { auth } from "../../../auth"

export default async function Dashboard() {
  const session = await auth();
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome {session?.user.name!}</h1>
     </main>
  );
}
