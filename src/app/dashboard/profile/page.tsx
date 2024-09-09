import Form from "@/components/ui/dashboard/profile/edit-form";  
import { notFound } from "next/navigation";
import { auth } from "../../../../auth";
import { UserRepository } from "@/lib/user-management/user.repository";

export default async function profile() {
    const session = await auth();
    const id = session?.user.id;
    // console.log(id);
    if (id) {
      const userRepo = new UserRepository();
      const userData = await userRepo.getById(id);
      if (userData) {
        return (
          <main>
            <Form user={userData} />
          </main>
        );
      } else {
        notFound();
      }
    }
}
