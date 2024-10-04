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
    header: "Professor Name",
  },
  {
    // accessorKey: "bio",
    header: "Bio",
    render: (person: IProfessor) => <span>{person.bio ? person.bio : ""}</span>,
  },
  {
    header: "Actions",
    render: (person: IProfessor) => (
      <div className="flex ">
        {person.link ? (
          <div>
            <AddAppointment id={person.userId} name={person.name} />
          </div>
        ) : (
          <div className="flex items-center bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
            <span className="text-lg">Joining Soon!</span>
          </div>
        )}
      </div>
    ),
  },
];

export default function MeetingsListPage({ data }: { data: IProfessor[] }) {
  const formattedData = data;

  return (
    <div className=" max-w-full w-full flow-root">
      <div className="min-w-fit align-middle">
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
                  <div className="flex  gap-3 ">
                    {person.link ? (
                      <div>
                        <AddAppointment id={person.userId} name={person.name} />
                      </div>
                    ) : (
                      <div className="flex items-center bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
                        <span className="text-lg">Joining Soon!</span>
                      </div>
                    )}
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
