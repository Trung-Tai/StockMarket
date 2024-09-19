"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/outline";
import Notification from "./Notification";

interface NotificationType {
  id: string;
  message: string;
  read: boolean;
}

const SigninButton = () => {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
    if (isNotificationMenuOpen) {
      setIsNotificationMenuOpen(false);
    }
  };

  const toggleNotificationMenu = async () => {
    setIsNotificationMenuOpen((prev) => !prev);
    if (isUserMenuOpen) {
      setIsUserMenuOpen(false);
    }
    if (!isNotificationMenuOpen && session?.user?.id) {
      try {
        const response = await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to mark notifications as read");
        }

        const data = await response.json();
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            read: true,
          }))
        );
        setUnreadCount(0);
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  useEffect(() => {
    if (session && session.user) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(
            `/api/notifications?userId=${session.user.id}`
          );
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(
              data.filter((notif: NotificationType) => !notif.read).length
            );
          }
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [session]);

  return (
    <div className="relative ml-auto flex items-center gap-4">
      {session && session.user ? (
        <>
          <button
            onClick={toggleUserMenu}
            className="relative flex items-center gap-2 text-white hover:text-yellow-400 transition-colors duration-300"
          >
            <span className="font-medium">
              {session.user.name || session.user.username}
            </span>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <button
            onClick={toggleNotificationMenu}
            className="relative text-white hover:text-yellow-400 ml-4 transition-colors duration-300"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg z-50 border border-gray-700">
              <div className="p-4">
                <Link href="/watchlist">
                  <span className="block px-4 py-2 hover:bg-gray-700 rounded-md transition-colors duration-300">
                    List Follow
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 rounded-md transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {isNotificationMenuOpen && (
            <Notification
              notifications={notifications}
              isOpen={isNotificationMenuOpen}
              onClose={() => setIsNotificationMenuOpen(false)}
            />
          )}
        </>
      ) : (
        <button className="text-white hover:text-yellow-400 ml-auto transition-colors duration-300">
          <Link href="/sign-in">
            <span>Sign In</span>
          </Link>
        </button>
      )}
    </div>
  );
};

export default SigninButton;
