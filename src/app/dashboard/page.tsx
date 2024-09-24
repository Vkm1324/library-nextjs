
import MetaData from "@/components/ui/dashboard/admin/meta-data-card";
import { auth } from "../../../auth"

export default  async function Dashboard() {
  const session = await auth();
  return (
    <main className="p-4"> 
      <h1 className="text-2xl font-bold mb-4">Welcome {session?.user.name!}</h1>
      <MetaData data={ [
      { status: "Due", value: 30, color: "#FFD700" },
      { status: "Overdue", value: 15, color: "#FF0000" },
      { status: "Completed", value: 45, color: "#008000" },
      { status: "Pending", value: 10, color: "#FFFFFF" },
    ]
  }></MetaData>
     </main>
  );
}

 