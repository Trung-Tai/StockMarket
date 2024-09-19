import React, { useState, useRef, useEffect } from "react";

interface NotificationType {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationProps {
  notifications: NotificationType[];
  isOpen: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  notifications,
  isOpen,
  onClose,
}) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-full mt-2 w-64 bg-gray-800 text-white rounded-lg shadow-lg z-50 border border-gray-700 overflow-y-auto max-h-96"
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-gray-400">No new notifications</p>
        ) : (
          <ul className="space-y-2">
            {notifications.slice(0, visibleCount).map((notification) => (
              <li
                key={notification.id}
                className={`py-2 px-4 rounded-md border border-gray-600 transition-transform duration-300 ${
                  notification.read ? "bg-gray-700" : "bg-gray-600"
                }`}
              >
                {notification.message}
              </li>
            ))}
          </ul>
        )}
        {visibleCount < notifications.length && (
          <button
            onClick={handleSeeMore}
            className="w-full text-center mt-2 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors duration-300"
          >
            See more
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;
