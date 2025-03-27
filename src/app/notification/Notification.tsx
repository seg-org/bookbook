import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      setNotifications(data);
    }

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message} - {notification.isRead ? "Read" : "Unread"}
          </li>
        ))}
      </ul>
    </div>
  );
}