import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "../../data/notification";
import { Notification } from "../../data/dto/notification.dto";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Bell } from "lucide-react"; // Import the Bell icon from lucide-react

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        if (!session?.user?.id) {
          console.error("User is not authenticated.");
          return;
        }

        const userId = session.user.id; // Get userId from session
        const result = await getNotifications(userId);

        if (!(result instanceof Error)) {
          setNotifications(result);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }

    fetchNotifications();
  }, [session]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      const updatedNotification = await markNotificationAsRead(notification.id);

      if (!(updatedNotification instanceof Error)) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      }
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const path = event.composedPath();
      if (!path.some((el) => (el as HTMLElement).classList?.contains("notification-dropdown"))) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        {/* Use the Bell icon */}
        <Bell className="text-gray-700" size={24} />
        {notifications.some((n) => !n.isRead) && (
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg bg-white shadow-lg z-50">
          <div className="p-4 font-bold text-gray-700">Notifications</div>
          <ul className="divide-y divide-gray-200">
            {notifications.slice(0, 3).map((notification) => (
              <li
                key={notification.id}
                className={`p-4 cursor-pointer ${
                  notification.isRead
                    ? "bg-gray-100 text-gray-500"
                    : "bg-white text-gray-800"
                } hover:bg-gray-200`}
                onClick={() => handleNotificationClick(notification)}
              >
                <span>{notification.message}</span>
              </li>
            ))}
          </ul>
          {notifications.length > 3 && (
            <div className="p-4 text-center text-sm text-gray-500">
              Scroll for more...
            </div>
          )}
        </div>
      )}
    </div>
  );
}