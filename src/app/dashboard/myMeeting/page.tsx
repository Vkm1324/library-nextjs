import { getScheduledEvents } from "@/lib/actions";
import { auth } from "../../../../auth";
import { CalendarX } from "lucide-react";
import EventCard from "./card";

export default async function MyMeetingsPage() {
  const session = await auth();
  const myevents = await getScheduledEvents(session?.user.email!);

  if (!myevents || myevents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <CalendarX className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          No meetings scheduled
        </h1>
        <p className="text-gray-500">
          You don`t have any upcoming meetings at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Meetings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myevents.map(
          (event: {
            event: string;
            status: string;
            start_time: string;
            end_time: string;
            meetLink: string;
            cancelLink: string;
            rescheduleLink: string;
            organizers: { name: string; email: string }[];
            invitees: { name: string; email: string }[];
          }) => (
            <EventCard
              key={event.meetLink} // Assuming meetLink is unique
              event={event.event}
              status={event.status}
              start_time={event.start_time}
              end_time={event.end_time}
              meetLink={event.meetLink}
              cancelLink={event.cancelLink}
              rescheduleLink={event.rescheduleLink}
              organizers={event.organizers}
              invitees={event.invitees}
            />
          )
        )}
      </div>
    </div>
  );
}
