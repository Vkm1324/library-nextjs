"use client"

import { CircleCheckIcon, CircleX } from "lucide-react";
import { reject, approve } from "@/lib/actions";
 
export function ApproveRequest({ id }: { id: number }) {
  const handleClick = async () => {
    try {
      const result = await approve(id);
      console.log(result.message); // Handle the result message or update the UI
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  return (
    <button
      className="flex items-center space-x-2 rounded-md border border-green-500 bg-green-100 p-2 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
      onClick={handleClick}
      aria-label="Approve request"
    >
      <CircleCheckIcon className="h-6 w-6 text-green-500" />
      <span className="text-green-800 font-medium">Approve</span>
    </button>
  );
}

export function RejectRequest({ id }: { id: number }) {
  const handleClick = async () => {
    try {
      const result = await reject(id);
      console.log(result.message); // Handle the result message or update the UI
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <button
      className="flex items-center space-x-2 rounded-md border border-red-500 bg-red-100 p-2 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
      onClick={handleClick}
      aria-label="Reject request"
    >
      <CircleX className="h-6 w-6 text-red-500" />
      <span className="text-red-800 font-medium">Reject</span>
    </button>
  );
}
