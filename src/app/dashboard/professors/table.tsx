"use client";

import * as React from "react";
import { AddAppointment } from "./appointment-button";
 
import { DataTable } from "@/components/ui/table/data-table";
import { GenericColumn } from "@/components/ui/table/columns";
import { IProfessor } from "@/lib/professors/models/model";

// Define columns for DataTable
const createMeetingsColumns = (): GenericColumn<IProfessor>[] => [
  {
    accessorKey: "userId",
    header: "Sl No",
  },
  {
    accessorKey: "name",
    header: "User Name",
  },
  {
    // accessorKey: "bio",
    header: "Bio",
    render:(person: IProfessor)=> (<span>{ person.bio ? person.bio : "" }</span>),
  },
  {
    header: "Actions",
    render: (person: IProfessor) => (
      <div className="flex justify-start gap-3">
        <AddAppointment id={person.userId} name={person.name} />
      </div>
    ),
  },
];

export default function MeetingsListPage({ data }: { data: IProfessor[] }) {
  const formattedData = data;

  return (
    <div className=" min-w-full flow-root">
      <div className="min-w-full align-middle">
        <div className="rounded-lg min-w-full bg-gray-50  p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {formattedData.map((person, index) => (
              <div
                key={person.userId}
                className="mb-2 w-full rounded-md bg-white p-4 shadow-md"
              >
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <p className="text-sm text-gray-500">{person.name}</p>
                    <p className="ml-4 text-sm text-gray-500">{person.bio}</p>
                  </div>
                  <div className="flex justify-start gap-3 pt-4">
                    <AddAppointment id={person.userId} name={person.name} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view using DataTable */}
          <DataTable
            columns={createMeetingsColumns()}
            data={formattedData}
            initialSortKey="pfid"
          />
        </div>
      </div>
    </div>
  );
}
