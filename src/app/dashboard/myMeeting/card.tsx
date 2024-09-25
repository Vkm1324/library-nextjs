import {
  CalendarIcon, 
  GlobeIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface EventCardProps {
  name: string;
  startTime: string;
  endTime: string;
  eventType: string;
  status: string;
  calendarPlatform: string;
  updatedAt: string;
  createdAt: string;
  locationType: string;
}

export default function EventCard({
  name,
  startTime,
  endTime,
  eventType,
  status,
  calendarPlatform,
  updatedAt,
  createdAt,
  locationType,
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
            {name}
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
              {formatDate(startTime)} - {format(parseISO(endTime), "h:mm a")}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <GlobeIcon className="w-5 h-5 mr-2" />
            <span>{locationType}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            <span>{calendarPlatform}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <a
            href={eventType}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Event Link
          </a>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>Created: {formatDate(createdAt)}</p>
          <p>Last Updated: {formatDate(updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}
