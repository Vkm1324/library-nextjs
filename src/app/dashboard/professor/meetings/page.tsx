import DetailedEventCard, { DetailedEventCardProps } from "./deatiled-card";


const dummyEvents: DetailedEventCardProps[] = [
  {
    name: "Math Seminar",
    startTime: "2024-09-25T10:00:00",
    endTime: "2024-09-25T12:00:00",
    eventType: "seminar",
    status: "active",
    calendarPlatform: "Google Calendar",
    updatedAt: "2024-09-20T08:00:00",
    createdAt: "2024-09-01T09:00:00",
    locationType: "online",
    uri: "https://example.com/seminar",
    inviteesCounter: {
      active: 25,
      limit: 50,
      total: 30,
    },
  },
  {
    name: "Physics Lecture",
    startTime: "2024-09-26T14:00:00",
    endTime: "2024-09-26T15:30:00",
    eventType: "lecture",
    status: "active",
    calendarPlatform: "Microsoft Outlook",
    updatedAt: "2024-09-21T10:00:00",
    createdAt: "2024-09-05T10:00:00",
    locationType: "offline",
    uri: "https://example.com/lecture",
    inviteesCounter: {
      active: 40,
      limit: 100,
      total: 45,
    },
  },
  {
    name: "Chemistry Workshop",
    startTime: "2024-09-27T09:00:00",
    endTime: "2024-09-27T11:00:00",
    eventType: "workshop",
    status: "canceled",
    calendarPlatform: "Apple Calendar",
    updatedAt: "2024-09-22T11:00:00",
    createdAt: "2024-09-10T11:00:00",
    locationType: "online",
    uri: "https://example.com/workshop",
    inviteesCounter: {
      active: 10,
      limit: 30,
      total: 12,
    },
  },
  {
    name: "Biology Conference",
    startTime: "2024-09-28T13:00:00",
    endTime: "2024-09-28T17:00:00",
    eventType: "conference",
    status: "active",
    calendarPlatform: "Zoom",
    updatedAt: "2024-09-23T12:00:00",
    createdAt: "2024-09-15T12:00:00",
    locationType: "offline",
    uri: "https://example.com/conference",
    inviteesCounter: {
      active: 75,
      limit: 150,
      total: 80,
    },
  },
];

export default async function MeetingsListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>
        Professor can see all his subscribers for his meeting Currently its
        dummy hard coded-data
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyEvents.map((event) => (
          <DetailedEventCard
            key={event.uri}
            name={event.name}
            startTime={event.startTime}
            endTime={event.endTime}
            eventType={event.eventType}
            status={event.status}
            calendarPlatform={event.calendarPlatform}
            updatedAt={event.updatedAt}
            createdAt={event.createdAt}
            locationType={event.locationType}
            inviteesCounter={event.inviteesCounter}
            uri={event.uri}
          />
        ))}
      </div>
    </div>
  );
}