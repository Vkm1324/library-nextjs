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
} from "../alert-dialog"; // Replace with your actual alert-dialog import
import { Button } from "../button"; // Replace with your actual Button import
import { TrashIcon } from "lucide-react"; // Assuming TrashIcon for delete action

interface DeleteAlertDialogProps {
  id: number;
  entity: string;
  deletePath: string; // Path to handle deletion (e.g., API endpoint or delete page)
  description: string;
}

export function DeleteAlertDialog({
  id,
  entity,
  deletePath,
  description,
}: DeleteAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Delete {entity}</span>
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
            {/* Here you can use either a Link for redirection or a function to make a delete request */}
            <Link href={`${deletePath}/${id}/delete`}>Proceed to Delete</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
