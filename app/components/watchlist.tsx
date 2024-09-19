"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface WatchlistItem {
  stockSymbol: string;
  stock: {
    name: string;
  };
}

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!session?.user?.id) {
        setError("User is not logged in");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/watchlist?userId=${session.user.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setWatchlist(result);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        setError("Error fetching watchlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [session?.user?.id]);

  const handleUnfollow = async (stockSymbol: string) => {
    if (!session?.user?.id) {
      setError("User is not logged in");
      return;
    }

    try {
      const response = await fetch("/api/watchlist/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          stockSymbol,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setWatchlist((prevWatchlist) =>
        prevWatchlist.filter((item) => item.stockSymbol !== stockSymbol)
      );
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      setError("Error removing from watchlist");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = watchlist.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(watchlist.length / itemsPerPage);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-800 text-white p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold text-orange-500 mb-4">
        My Watchlist
      </h2>
      {watchlist.length === 0 ? (
        <p>No stocks in your watchlist.</p>
      ) : (
        <div className="w-full max-w-2xl bg-gray-700 rounded-lg shadow-md">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-600">
                <th className="border border-gray-500 px-4 py-2 text-left w-1/5">
                  Symbol
                </th>
                <th className="border border-gray-500 px-4 py-2 text-left w-2/3">
                  Name
                </th>
                <th className="border border-gray-500 px-4 py-2 text-left w-1/4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index} className="border-t border-gray-500">
                  <td className="border border-gray-500 px-4 py-2 w-1/5 overflow-hidden text-ellipsis whitespace-nowrap">
                    <button
                      onClick={() => router.push(`/Stock/${item.stockSymbol}`)}
                      className="text-blue-400 hover:underline"
                    >
                      {item.stockSymbol}
                    </button>
                  </td>
                  <td className="border border-gray-500 px-4 py-2 w-2/3 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.stock.name}
                  </td>
                  <td className="border border-gray-500 px-4 py-2 w-1/4">
                    <button
                      onClick={() => handleUnfollow(item.stockSymbol)}
                      className="text-red-600 hover:bg-gray-600 px-2 py-1 rounded"
                    >
                      Unfollow
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
