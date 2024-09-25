import { ProfessorRepository } from "@/lib/professors/professors.repsitory";
import CalendlyCalander from "./calendly";

import { notFound } from "next/navigation"; 
import { auth } from "../../../../../../auth";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id; 
  const session = await auth();
  const userEmail = session?.user.email;
  const userName = session?.user.name;

  const prefill = {
    email: userEmail ? userEmail :"",
    name: userName ? userName :"",
  };
  const prop = new ProfessorRepository();
  const professor = await prop.getById(+id);
  const calendlyUrl = professor?.link;
  //  await book.getById(+id);
  if (!calendlyUrl) {
    notFound();
  }
  return (
    <main>
      <CalendlyCalander calendlyId={calendlyUrl} prefill={ prefill} />
    </main>
  );
}
