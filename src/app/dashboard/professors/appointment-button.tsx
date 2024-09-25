"use client ";

import { ConfirmationAlertDialog } from "./[id]/meet/alert";

export function AddAppointment({ id, name }: { id: number; name:string }) {
  return (
    <ConfirmationAlertDialog
      id={id}
      editPath={"/dashboard/professors/"}
      description={`You are going to set a meeting with the professor ${name}`}
    ></ConfirmationAlertDialog>
  );
}
