import { useState } from "react";

import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../alert-dialog"; // Replace with you  // Replace with your actual Button import
import { Button } from "../button";
import { PencilIcon } from "lucide-react";

interface EditAlertDialogProps {
  id: number;
  entity: string;
  editPath: string;
  description: string;
}

export function EditAlertDialog({
  id,
  entity,
  editPath,
  description,
}: EditAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
        >
          <PencilIcon className="w-4 h-4" />
          <span>Edit {entity}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href={`${editPath}/${id}/edit`}>Proceed to Edit</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
