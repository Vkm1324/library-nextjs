interface Invitee {
  name: string;
  email: string;
}

interface Organizer {
  name: string;
  email: string;
}

interface EventCardProps {
  event: string;
  status: string;
  start_time: string;
  end_time: string;
  meetLink: string;
  cancelLink: string;
  rescheduleLink: string;
  organizers: Organizer[];
  invitees: Invitee[];
}
import { CalendarIcon, GlobeIcon, CalendarDaysIcon } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function EventCard({
  event,
  status,
  start_time,
  end_time,
  meetLink,
  cancelLink,
  rescheduleLink,
  organizers,
  invitees,
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
            {event}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="w-5 h-5 mr-2" />
            <span>
              {formatDate(start_time)} - {format(parseISO(end_time), "h:mm a")}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <GlobeIcon className="w-5 h-5 mr-2" />
            <span>
              {organizers.map((organizer) => organizer.name).join(", ")}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            <span>
              Meet Link:{" "}
              <a
                href={meetLink}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join
              </a>
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <a
            href={cancelLink}
            className="text-red-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cancel Event
          </a>
          <br />
          <a
            href={rescheduleLink}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reschedule Event
          </a>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>Invitees:</p>
          <ul>
            {invitees.map((invitee, index) => (
              <li key={index}>
                {invitee.name} ({invitee.email})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
