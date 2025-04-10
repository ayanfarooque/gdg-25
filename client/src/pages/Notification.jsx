import React, { useEffect, useState } from "react";
import axios from "axios";
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/notify/all-notifications");
        console.log("Fetched Notifications:", response.data);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


  return (
    <div className="min-h-screen text-black flex flex-col items-center bg-gradient-to-r from-gray-100 to-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🔔 Notifications</h1>

      <div className="w-full max-w-3xl overflow-y-auto bg-white shadow-lg rounded-lg p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading notifications...</p>
        ) : notifications.length > 0 ? (
          <ul className="space-y-4 overflow-auto">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="p-4 bg-gray-50 shadow-md rounded-lg transition-transform transform hover:scale-105 duration-300"
              >
                <p className="text-gray-900 font-medium">{notification.notificationContent}</p>
                <p className="text-xs text-gray-500 mt-2">
                  🕒 {new Date(notification.notificationTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  📩 Sent by: {notification.teacherId ? "Teacher" : "College System"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No notifications available</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
