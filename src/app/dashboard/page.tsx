
import MetaData from "@/components/ui/dashboard/admin/meta-data-card";
import { auth } from "../../../auth" 
import { getRole } from "@/middleware";
import {  metaDataOfTransactions } from "@/lib/transaction/transaction.repository";
import { getTranslations } from "next-intl/server";

export default async function Dashboard() {
  const totalTransaction = await metaDataOfTransactions();
  const t =await  getTranslations("LandingPage");
const pending = (totalTransaction.totalTransactions - (totalTransaction.overdueTransactions + totalTransaction.todaysDueTransactions + totalTransaction.completedTransactions))
  const session = await auth();
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome{ " "} { t("message", { name: session?.user.name })}
      </h1>
      <h1 className="text-2xl font-bold mb-4">
        Logged In as {getRole(session?.user.role)}
      </h1>
      <MetaData
        data={[
          {
            status: "Due",
            value: totalTransaction.todaysDueTransactions,
            color: "#FFD700",
          },
          {
            status: "Overdue",
            value: totalTransaction.overdueTransactions,
            color: "#FF0000",
          },
          {
            status: "Completed",
            value: totalTransaction.completedTransactions,
            color: "#008000",
          },
          {
            status: "pending",
            value: pending,
            color: "#FFFFFF",
          },
        ]}
      ></MetaData>
    </main>
  );
}

 