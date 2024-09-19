"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

interface StockData {
  symbol: string;
  name: string;
  groupName: string;
}

interface Group {
  id: number;
  name: string;
}

const IntensiveData: React.FC = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<StockData[]>([]);
  const [suggestions, setSuggestions] = useState<
    { symbol: string; name: string }[]
  >([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/quoteGroup");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setGroups(result);
        if (result.length > 0) {
          setSelectedGroup(result[0].id.toString());
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError("Error fetching groups");
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `/api/quote?timeRange=1`;
        if (selectedGroup) {
          url += `&groupId=${selectedGroup}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGroup]);

  useEffect(() => {
    if (userId) {
      fetchWatchlist();
    }
  }, [userId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const searchResults = data
        .filter((row) =>
          row.symbol.toLowerCase().includes(value.trim().toLowerCase())
        )
        .map((row) => ({ symbol: row.symbol, name: row.name }));
      setSuggestions(searchResults.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: {
    symbol: string;
    name: string;
  }) => {
    setSearchTerm(suggestion.symbol);
    setSuggestions([]);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      const searchResults = data.filter((row) =>
        row.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(searchResults);
    } else {
      setFilteredData(data);
    }
  };

  const fetchWatchlist = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/watchlist?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setWatchlist(
        result.map((item: { stockSymbol: string }) => item.stockSymbol)
      );
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      setError("Error fetching watchlist");
    }
  };

  const handleFollow = async (symbol: string) => {
    if (!userId) {
      signIn();
      return;
    }

    try {
      const response = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, stockSymbol: symbol }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error adding to watchlist:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setWatchlist((prevWatchlist) => [...prevWatchlist, symbol]);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      setError("Error adding to watchlist");
    }
  };

  const handleUnfollow = async (symbol: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/watchlist/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, stockSymbol: symbol }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error removing from watchlist:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setWatchlist(watchlist.filter((item) => item !== symbol));
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      setError("Error removing from watchlist");
    }
  };

  const handleSymbolClick = (symbol: string) => {
    router.push(`/Stock/${symbol}`);
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const rows = [...selectedData];
  while (rows.length < itemsPerPage) {
    rows.push({
      symbol: "",
      name: "",
      groupName: "",
    });
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="bg-gray-800 container mx-auto py-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Market statistics
          </h2>
          <div className="flex items-center mb-4">
            <select
              className="bg-gray-700 text-white p-2 rounded mr-2"
              value={selectedGroup || ""}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setCurrentPage(1); // Reset page to 1 when group changes
              }}
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <div className="relative ml-auto">
              <input
                type="text"
                className="bg-gray-700 text-white p-2 rounded"
                placeholder="Search by symbol"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />
              <button
                onClick={handleSearchSubmit}
                className="ml-2 bg-orange-500 text-white px-4 py-2 rounded"
              >
                Search
              </button>
              {suggestions.length > 0 && (
                <div className="absolute bg-gray-700 mt-1 rounded-lg w-full">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.symbol}
                      className="p-2 cursor-pointer hover:bg-gray-600"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.symbol} - {suggestion.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full table-fixed border-collapse border border-gray-700">
              <thead>
                <tr>
                  <th className="border border-gray-600 px-4 py-2 w-1/6">
                    Symbol
                  </th>
                  <th className="border border-gray-600 px-4 py-2 w-1/2">
                    Name
                  </th>
                  <th className="border border-gray-600 px-4 py-2 w-1/6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-600 cursor-pointer"
                  >
                    <td
                      className="border border-gray-600 px-8 py-2"
                      onClick={() => handleSymbolClick(row.symbol)}
                    >
                      {row.symbol}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {row.name}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {row.symbol ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (watchlist.includes(row.symbol)) {
                              handleUnfollow(row.symbol);
                            } else {
                              handleFollow(row.symbol);
                            }
                          }}
                          className="bg-orange-500 text-white px-4 py-2 rounded"
                        >
                          {watchlist.includes(row.symbol)
                            ? "Unfollow"
                            : "Follow"}
                        </button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-700 text-white px-4 py-2 rounded"
              disabled={currentPage === 1}
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
              className="bg-gray-700 text-white px-4 py-2 rounded"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntensiveData;
