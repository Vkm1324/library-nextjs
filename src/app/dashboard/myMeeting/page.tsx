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
          You dont have any upcoming meetings at the moment.
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
            uri: any;
            name: any;
            start_time: any;
            end_time: any;
            event_type: any;
            status: any;
            calendar_event: { kind: any };
            updated_at: any;
            created_at: any;
            location: {
                join_url: string;
                type: any 
};
          }) => (
            <EventCard
              key={event.uri}
              name={event.name}
              startTime={event.start_time}
              endTime={event.end_time}
              eventType={event.location.join_url}
              status={event.status}
              calendarPlatform={event.calendar_event.kind}
              updatedAt={event.updated_at}
              createdAt={event.created_at}
              locationType={event.location.type}
            />
          )
        )}
      </div>
    </div>
  );
}
