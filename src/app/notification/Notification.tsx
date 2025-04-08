import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Notification {
  id: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function Notifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function fetchNotifications() {
      if (!session?.user?.id) return;

      const response = await fetch(`/api/notifications?userId=${session.user.id}`);
      const data: Notification[] = await response.json();
      setNotifications(data);
    }

    fetchNotifications();
  }, [session]);

  async function markAsRead(notificationId: string) {
    await fetch(`/api/notifications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: notificationId }),
    });

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
  }

  return (
    <div className="relative">
      <h2 className="text-lg font-bold">Notifications</h2>
      <ul className="mt-4 space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-lg ${
                notification.isRead ? "bg-gray-100" : "bg-blue-100"
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex justify-between">
                <p>{notification.message}</p>
                {notification.link && (
                  <Link href={notification.link}>
                    <a className="text-blue-500 underline">View</a>
                  </Link>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No notifications</li>
        )}
      </ul>
    </div>
  );
}