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
} from  "@/components/ui/alert-dialog"; 
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";


interface EditAlertDialogProps {
  id: number; 
  editPath: string;
  description: string;
}

export function ConfirmationAlertDialog({
  id,
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
          <Calendar className="w-4 h-4" />
          <span>Join Meetings</span>
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
            <Link href={`${editPath}/${id}/meet`}>Proceed to create Meeting</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
