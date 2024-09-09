 import { notFound } from "next/navigation";
import Form from "@/components/ui/dashboard/users/edit-form";
import { UserRepository } from "@/lib/user-management/user.repository";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const users = new UserRepository();
  const userData = await users.getById(+id); 
      if (!userData) {
        notFound();
      }
  return (
    <main>
      <Form user={userData}  />
    </main>
  );
}
