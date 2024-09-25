import Form from "@/components/ui/dashboard/profile/edit-form";  
import { notFound } from "next/navigation";
import { auth } from "../../../../auth";
import { UserRepository } from "@/lib/user-management/user.repository";
import { getRole } from "@/middleware";
import { ProfessorRepository } from "@/lib/professors/professors.repsitory";
import EditProfessorProfileForm from "@/components/ui/dashboard/profile/professor-edit-form";

export default async function Profile() {
    const session = await auth();
    const id = session?.user.uId; 
  const role = getRole(session?.user.role); 
    if (id) {
      const userRepo = new UserRepository();
      const profRepo = new ProfessorRepository();
      const profData = await profRepo.getById(id);
      const userData = await userRepo.getById(id);
      if (userData) {
        return (
          <main>
            {
              (role === "Professor" && profData ? (
                <EditProfessorProfileForm
                  user={{
                    ...profData,
                    ...userData,
                  }}
                />
              ) : (
                <Form user={userData} />
              ))
            }
          </main>
        );
      } else {
        notFound();
      }
    }
}
